const { result, err } = require("../util");
const AliPayForm = require("alipay-sdk/lib/form").default;
const alipaySdk = require("../util/alipay");

const pagePay = async (req, res, next) => {
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
};

const refund = async (req, res, next) => {
  const { orderID, price } = req.body;
  const bizContent = {
    refund_amount: price, // 退款金额
    out_trade_no: orderID, // 单号
  };

  console.log(bizContent);

  const formData = new AliPayForm();

  formData.setMethod("get");
  formData.addField("bizContent", JSON.stringify(bizContent));

  const url = await alipaySdk.exec("alipay.trade.refund", {}, { formData });
  res.send(result(200, url, "ok"));
};

module.exports = { pagePay, refund };
