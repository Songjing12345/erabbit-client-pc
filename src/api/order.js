import request from '@/utils/request'

/**
 * 获取结算信息
 */
export const findCheckoutInfo = () => {
  return request('/member/order/pre', 'get')
}
/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}
/**
 * 修改收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}
/**
 * 提交订单
 * @param {Object} order - 订单信息对象
 */
export const createOrder = (order) => {
  return request('/member/order', 'post', order)
}