//格式化表格数据
export function tableRowFormat(data) {
  const dataList = data.data.rows || []
  let list = []
  dataList.forEach((item, index) => {
    let jsonData = {}
    for (let key in item) {
      jsonData[key] = item[key].text
    }
    list.push(jsonData)
  })
  data.data.list = list
  return data
}