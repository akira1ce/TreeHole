const { result, err } = require("../util");
const AliPayForm = require("alipay-sdk/lib/form").default;
const alipaySdk = require("../util/alipay");
const axios = require("axios").default;

const pagePay = async (req, res, next) => {
  try {
    const { orderID, title, describe, price } = req.body;
    const bizContent = {
      out_trade_no: orderID, //单号
      product_code: "FAST_INSTANT_TRADE_PAY", //这个固定写法就行了
      subject: title, //本次支付单的名字
      body: describe, //商品的描述
      total_amount: price, //总共的价格
    };
    const formData = new AliPayForm();

    formData.setMethod("get");
    formData.addField("bizContent", JSON.stringify(bizContent));

    const url = await alipaySdk.exec("alipay.trade.page.pay", {}, { formData });
    res.send(result(200, url, "ok"));
  } catch (e) {
    next(err(e));
  }
};

const refund = async (req, res, next) => {
  try {
    const { orderID, price } = req.body;
    const bizContent = {
      refund_amount: price, // 退款金额
      out_trade_no: orderID, // 单号
    };

    const formData = new AliPayForm();

    formData.setMethod("get");
    formData.addField("bizContent", JSON.stringify(bizContent));

    const url = await alipaySdk.exec("alipay.trade.refund", {}, { formData });
    const refundRes = await axios.get(url);

    res.send(result(200, refundRes.data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

const query = async (req, res, next) => {
  try {
    const { orderID } = req.body;
    const bizContent = {
      out_trade_no: orderID,
    };

    const formData = new AliPayForm();

    formData.setMethod("get");
    formData.addField("bizContent", JSON.stringify(bizContent));

    const url = await alipaySdk.exec("alipay.trade.query", {}, { formData });
    let queryRes = await axios.get(url);
    queryRes = queryRes.data.alipay_trade_query_response;

    if (queryRes.code == "10000") {
      // 接口调用成功
      switch (queryRes.trade_status) {
        case "WAIT_BUYER_PAY":
          res.send(result(200, { status: 0, massage: "交易创建，等待买家付款" }, "success"));
          break;
        case "TRADE_CLOSED":
          res.send(result(200, { status: 1, massage: "未付款交易超时关闭，或支付完成后全额退款" }, "success"));
          break;
        case "TRADE_SUCCESS":
          res.send(result(200, { status: 2, massage: "交易支付成功" }, "success"));
          break;
        case "TRADE_FINISHED":
          res.send(result(200, { status: 3, massage: "交易结束，不可退款" }, "success"));
          break;
      }
    } else if (queryRes.code == "40004") {
      res.send(result(200, { status: -1, massage: "交易不存在" }, "success"));
    }
  } catch (e) {
    next(err(e));
  }
};

module.exports = { pagePay, refund, query };
