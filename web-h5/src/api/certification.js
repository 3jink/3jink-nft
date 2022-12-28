import request, { sendRequest } from "./../util/request"

const baseApi = '/account/';

const verifyApi = {
    verifyRealName:baseApi+'verifyrealname',
    queryRealName:baseApi+'queryrealname'
}

/**
 * 发起实名认证
 * @param req
 * @returns {Promise<*>}
 */
export  async function verifyRealName(req){
    const res = await sendRequest({
        url: verifyApi.verifyRealName,
        method: 'post',
        data: req
    })
    return res
}

/**
 * 查询实名认证结果
 * @param req
 * @returns {Promise<*>}
 */
export  async function queryRealName(){
    const res = await sendRequest({
        url: verifyApi.queryRealName+'?id=1',
        method: 'get'
    })
    return res
}
