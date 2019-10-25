// 毫无意义的类声明。。。
export class WorkHour {
  [propName: string]: any
  // 不可编辑
  disabled: boolean = true
  constructor (obj: any) {
    for (let key of Object.keys(obj)) {
      this[key] = obj[key]
    }
  }
}

export class InStock {
  [propName: string]: any
  constructor (obj: any) {
    for (let key of Object.keys(obj)) {
      this[key] = obj[key]
    }
  }
}

export class Material {
  [propName: string]: any
  constructor (obj: any) {
    for (let key of Object.keys(obj)) {
      this[key] = obj[key]
    }
  }
}
