import request from "../api/request";
import api from "../api";

const updateUser = async () => {
  try {
    const _id = localStorage.getItem("_id") || "";
    const res = await request.post(api.user.getUserById, { _id });
    return res;
  } catch (e) {
    console.log(`output->e`, e);
  }
  return {};
};

export {
  updateUser,
};
