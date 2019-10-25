import { Status } from './Enum.ts'
export class House {
  orderId: string
  orderNo: string
  materialCode: string
  materialName: string
  houseNo: string
  inPotNoName: string
  inEndTime: string
  inEndTimeLength: string
  orderHouseId: string
  _status: string
  _beanStatus: string
  _guardStatus: string
  _outStatus: string
  constructor (orderId: string, orderNo: string, materialCode: string, materialName: string, houseNo: string, inPotNoName: string,
    inEndTime: string, inEndTimeLength: string, orderHouseId: string, status: string, beanStatus: string, guardStatus: string, outStatus: string) {
    this.orderId = orderId
    this.orderNo = orderNo
    this.materialCode = materialCode
    this.materialName = materialName
    this.houseNo = houseNo
    this.inPotNoName = inPotNoName
    this.inEndTime = inEndTime
    this.inEndTimeLength = inEndTimeLength
    this.orderHouseId = orderHouseId
    this.status = status
    this.beanStatus = beanStatus
    this.guardStatus = guardStatus
    this.outStatus = outStatus
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
  get beanStatus (): string {
    if (this._beanStatus === '已同步') {
      return Status.UNDO
    } else if (this._beanStatus === 'toBeAudited') {
      return Status.TOBE // 待审核
    } else if (this._beanStatus === 'saved') {
      return Status.SAVED
    } else if (this._beanStatus === 'submit') {
      return Status.SUBMIT
    } else if (this._beanStatus === 'checked') {
      return Status.CHECKED
    } else if (this._beanStatus === 'noPass') {
      return Status.NOPASS
    }
    return this._beanStatus
  }
  set beanStatus (status: string) {
    this._beanStatus = status
  }
  get guardStatus (): string {
    if (this._guardStatus === '已同步') {
      return Status.UNDO
    } else if (this._guardStatus === 'toBeAudited') {
      return Status.TOBE // 待审核
    } else if (this._guardStatus === 'saved') {
      return Status.SAVED
    } else if (this._guardStatus === 'submit') {
      return Status.SUBMIT
    } else if (this._guardStatus === 'checked') {
      return Status.CHECKED
    } else if (this._guardStatus === 'noPass') {
      return Status.NOPASS
    }
    return this._guardStatus
  }
  set guardStatus (status: string) {
    this._guardStatus = status
  }
  get outStatus (): string {
    if (this._outStatus === '已同步') {
      return Status.UNDO
    } else if (this._outStatus === 'toBeAudited') {
      return Status.TOBE // 待审核
    } else if (this._outStatus === 'saved') {
      return Status.SAVED
    } else if (this._outStatus === 'submit') {
      return Status.SUBMIT
    } else if (this._outStatus === 'checked') {
      return Status.CHECKED
    } else if (this._outStatus === 'noPass') {
      return Status.NOPASS
    }
    return this._outStatus
  }
  set outStatus (status: string) {
    this._outStatus = status
  }
}
