import { Order } from './Order.ts'
import { Status } from './Enum.ts'

export class OrderDetail extends Order {
  id: string
  _status: string
  inPotNo: string = ''
  inPotName: string = ''
  houseNo: string = ''
  houseName: string = ''
  cookingNo: string = ''
  cookingName: string = ''
  inKjmDate: string
  productDate: string
  isFirst: boolean = false
  constructor (orderId?: string, orderNo?: string, orderDate?: string, orderStatus?: string, materialCode?: string, materialName?: string,
    planOutput?: number, outputUnit?: string, remark?: string, delFlag?: string, id?: string, status?: string, inPotNo?: string, inPotName?: string, houseNo?: string,
    houseName?: string, cookingNo?: string, cookingName?: string, inKjmDate?: string, productDate?: string, isFirst?: boolean
    ) {
    super(orderId, orderNo, orderDate, orderStatus, materialCode, materialName, planOutput, outputUnit, remark, delFlag)
    if (id) {
      this.id = id
    }
    if (status) {
      this._status = status
    }
    if (inPotNo) {
      this.inPotNo = inPotNo
    }
    if (inPotName) {
      this.inPotName = inPotName
    }
    if (houseNo) {
      this.houseNo = houseNo
    }
    if (houseName) {
      this.houseName = houseName
    }
    if (cookingNo) {
      this.cookingNo = cookingNo
    }
    if (cookingName) {
      this.cookingName = cookingName
    }
    if (inKjmDate) {
      this.inKjmDate = inKjmDate
    }
    if (productDate) {
      this.productDate = productDate
    }
    if (isFirst) {
      this.isFirst = isFirst
    }
  }

  get status (): string {
    if (this._status === '已同步') {
      return Status.UNDO
    } else if (this._status === 'toBeAudited') {
      return Status.TOBE // 待审核
    } else if (this._status === 'saved') {
      return Status.SAVED
    } else if (this._status === 'submit') {
      return Status.SUBMIT
    } else if (this._status === 'checked') {
      return Status.CHECKED
    } else if (this._status === 'noPass') {
      return Status.NOPASS
    }
    return this._status
  }
  set status (status: string) {
    this._status = status
  }

  public clone (): OrderDetail {
    return JSON.parse(JSON.stringify(this))
  }
}
