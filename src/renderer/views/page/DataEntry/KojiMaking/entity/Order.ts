import { Status } from './Enum.ts'

export class Order {
  orderId: string
  orderNo: string
  materialCode: string
  materialName: string
  planOutput: number
  outputUnit: string
  private _orderStatus: string
  remark: string
  orderDate: string
  delFlag: string = '0'
  get orderStatus (): string {
    if (this._orderStatus === '已同步') {
      return Status.SYNC // 已同步
    } else if (this._orderStatus === '已拆分') {
      return Status.UNDO // 未录入
    } else if (this._orderStatus === 'toBeAudited') {
      return Status.TOBE // 待审核
    } else if (this._orderStatus === 'saved') {
      return Status.SAVED // 已保存
    } else if (this._orderStatus === 'submit') {
      return Status.SUBMIT // 已提交
    } else if (this._orderStatus === 'checked') {
      return Status.CHECKED // 通过
    } else if (this._orderStatus === 'noPass') {
      return Status.NOPASS // 不通过
    }
    return this._orderStatus
  }
  set orderStatus (status: string) {
    this._orderStatus = status
  }
  constructor (orderId: string, orderNo: string, orderDate: string, orderStatus: string, materialCode: string, materialName: string,
    planOutput: number, outputUnit: string, remark: string, delFlag: string) {
    this.orderId = orderId
    this.orderNo = orderNo
    this.orderDate = orderDate
    this.orderStatus = orderStatus
    this.materialCode = materialCode
    this.materialName = materialName
    this.planOutput = planOutput
    this.outputUnit = outputUnit
    this.remark = remark
    this.delFlag = delFlag
  }
}
