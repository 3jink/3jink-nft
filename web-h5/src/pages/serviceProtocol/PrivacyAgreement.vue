<template>
  <view class="content flex fd-c">
<!--    <uni-nav-bar left-icon="left" title="隐私政策" />-->
    <view class="px-4 flex-1 of-a">
      <view class="title-box fs-50 mt-80 fw-600">
		  数源三街隐私政策
      </view>

      <view class="content-wrapper">
		  <view v-html="privacyContent" class="fs-28 fw-b fc-7f"/>
      </view>
    </view>
  </view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
export default {
  name: "PrivacyAgreement",
  components:{uniNavBar},
	data() {
		return {
			privacyContent: `<p>
    尊敬的用户（“您”）：
</p>
<br/>
<br/>
<p>
    欢迎您使用数源三街平台（包括数源三街APP、公众号、H5页面和数源三街官方网站，以下简称“本平台”）。您在使用本平台服务时，我们可能会收集和使用您的相关个人信息。我们深知个人信息对您的重要性，并将竭尽全力保护您的个人信息安全。我们将按国家法律法规要求，恪守权责一致、目的明确、选择同意、最小必要、公开透明、确保安全、主体参与的原则，保护您的个人信息。为了帮助您了解我们收集您的哪些个人信息，以及您在使用本平台时，我们如何使用、保存、共享和转让这些信息，我们特制定《数源三街隐私政策》（以下简称“本政策”）。请您仔细阅读本政策。
</p>
<p>
    <br/>
</p>
<p>
    本政策将帮助您了解以下内容：
</p>
<p>
    &nbsp; &nbsp; 1.我们如何收集和使用您的个人信息
</p>
<p>
    &nbsp; &nbsp; 2.我们如何使用Cookie及相关技术
</p>
<p>
    &nbsp; &nbsp; 3.我们如何共享、转让、公开披露您的个人信息
</p>
<p>
    &nbsp; &nbsp; 4.您对个人信息的权利
</p>
<p>
    &nbsp; &nbsp; 5.我们如何保护您的个人信息
</p>
<p>
    &nbsp; &nbsp; 6.我们如何存储您的个人信息
</p>
<p>
    &nbsp; &nbsp; 7.未成年人个人信息保护
</p>
<p>
    &nbsp; &nbsp; 8.对外提供
</p>
<p>
    &nbsp; &nbsp; 9.本政策的更新
</p>
<p>
    <br/>
</p>
<p>
    <strong>一、我们如何收集和使用您的个人信息</strong>
</p>
<p>
    <br/>
</p>
<p>
    1.1 帮助您注册账号
</p>
<p>
    为了创建您在本平台的账号，您需要向我们提供您的手机号码、头像、昵称、性别。如果您拒绝提供上述信息，我们将无法为您创建账号。
</p>
<p>
    <br/>
</p>
<p>
    1.2 帮助您完成实名验证
</p>
<p>
    根据区块链信息服务要求及反洗钱相关要求，为了帮助您完成实名验证，您需要向我们提供您的真实姓名、身份证号和身份证照片，并且我们需要调用相机权限，通过您拍摄上传的照片收集您的人脸面部识别信息来验证您提供信息的真实、有效性，在获得您的明确同意后，第三方验证平台收集您的人脸信息用于身份验证，并向我们反馈核验结果。手机号码和身份证件信息、人脸信息属于敏感信息，收集此类信息是为了满足相关法律法规的网络实名制要求。若您不提供这类信息，您可能无法正常使用我们的服务。
</p>
<p>
    <br/>
</p>
<p>
    1.3 查看您在本平台的积分
</p>
<p>
    我们将收集您在本平台的积分,您可以使用该积分进行，积分可用于购买、兑换平台商品。
</p>
<p>
    <br/>
</p>
<p>
    1.4 个人主页展示
</p>
<p>
    我们将收集您持有的盲盒、已收藏的数字藏品、您关注的创作家，以及您参加的限时活动等信息，并将上述信息在您的个人主页公开展示。
</p>
<p>
    <br/>
</p>
<p>
    1.5 向您展示商品或服务信息
</p>
<p>
    为了根据您使用设备的情况，向您更好地展示商品或服务信息，提供更优质的服务，并帮助我们确保操作环境的安全，我们会收集和使用您在访问和使用本平台时的设备信息、软件信息、IP地址和服务日志信息，其中：
</p>
<p>
    设备信息：我们会收集您使用产品或服务时使用的设备的属性、链接、状态信息，可能包括设备型号、操作系统版本、Android ID、唯一设备标识符、电信运营商、使用的语言、硬件型号、设备配置、国际移动设备身份码IMEI、网络设备硬件地址MAC、广告标识符IDFA、设备传感器数据，设备应用安装列表。
</p>
<p>
    软件信息：我们会收集有关您使用的移动应用和其他软件的信息，包括软件的版本号、浏览器类型。&nbsp;
</p>
<p>
    服务日志信息：我们会收集您访问和使用本平台的情况，作为服务日志保存，包括您搜索和查看的历史信息记录、服务故障信息、引荐网址。
</p>
<p>
    <br/>
</p>
<p>
    1.6 帮助您完成交易
</p>
<p>
    &nbsp; &nbsp; 1.6.1 当您购买盲盒或数字藏品时，我们会收集您的交易信息，包括盲盒或数字藏品信息、订单号、交易时间、交易金额信息，以便帮助您顺利完成交易、保障您的交易安全。
</p>
<p>
    &nbsp; &nbsp; 1.6.2 当您选择绑定银行卡进行支付时，您理解并同意我们收集、存储、使用您自行填写或授权第三方提供的信息与合作银行或合法留存您信息的第三方进行交叉验证及数据校验。
</p>
<p>
    &nbsp; &nbsp; 1.6.3 您同意并授权我们在您首次使用支付时收集您在本平台绑卡页面填写的或者您授权当前登录的第三方平台传输给我们的姓名、身份证件类型及号码、银行卡号、银行预留手机号等要素，传输给您的发卡行；发卡行匹配比对前述信息与您在银行预留信息一致后，您同意并授权发卡行向我们返回验证结果，并在您的银行账号与支付账号、当前平台账号之间建立绑定支付关系。
</p>
<p>
    &nbsp; &nbsp; 1.6.4 您授权并同意我们在对您的平台账号进行实名认证后，记录并保存经过认证的银行卡信息（姓名、身份证件类型及号码、银行卡号、银行预留手机号），并自动对您平台账号下绑定的银行卡进行实名认证操作。&nbsp;
</p>
<p>
    &nbsp; &nbsp; 1.6.5 为了及时、准确地完成付款，并满足反洗钱等监管要求，您理解并同意我们需要记录您使用支付服务的平台账号实名认证信息、银行卡信息、交易信息。在您使用本服务期间及本服务终止后，您理解并同意我们在相关法律法规或监管要求的期限内留存您在使用本服务过程中产生的相关数据。
</p>
<p>
    &nbsp; &nbsp; 1.6.6 您知悉并授权我们将您已绑定的银行卡卡号、卡类型汇总并脱敏展示在我们的卡中心列表，并与您的平台账号关联。
</p>
<p>
    <br/>
</p>
<p>
    1.7 为您提供更多的优惠服务
</p>
<p>
    我们可能会与银行、第三方支付平台、卡组织、数源三街关联公司或创作家联合向您提供支付优惠服务或者推送商品/支付优惠服务相关的消息或通知，如首次签约支付优惠、快捷支付优惠立减、满减、积分兑换、积分抵现等，您同意授权我们根据您的绑卡时间、使用活跃度、积分情况、支付订单信息等进行优惠活动推荐。我们保证该等信息仅用于数源三街业务场景下向您提供相关营销服务或对账目的，不会向任何第三方透露或允许第三方使用。您支付时主动选择使用有优惠券的银行卡或第三方支付平台，即视为您同意授权参加该银行、第三方支付平台与数源三街的联合营销活动。 <br/>
</p>
<p>
    <br/>
</p>
<p>
    1.8 为您提供基于相机/摄像头的附加服务
</p>
<p>
    您可在开启相机/摄像头权限后使用该功能进行扫码用于登录、添加好友、查询实体盲盒信息，以及特定场景下经您授权的 人脸识别、通过第三方组件ARKit实现AR虚拟试穿、展示功能。当您使用该附加功能进行人脸识别时，我们会收集您的面部特征，且严格在经您授权同意的范围内使用，未来如我们拟使用您的面部信息为您提供其他产品及/或服务功能的，我们会再次与您确认。在您授权我们基于前述目的收集您的面部特征后，您可以前往手机的系统设置更改您对我们的授权；如果您拒绝提供上述信息的，将不能使用上述功能，但不影响您使用我们的其他业务功能。
</p>
<p>
    <br/>
</p>
<p>
    1.9 联系好友
</p>
<p>
    为了向您展示您附近的好友，我们还将调用位置权限收集您的位置信息。如果您拒绝提供上述信息的，将无法查看您的附近好友，但不影响您使用我们的其他业务功能。
</p>
<p>
    <br/>
</p>
<p>
    1.10 与您沟通联系
</p>
<p>
    为了确保您可以接收我们发送的消息通知，您需要向我们提供您的邮箱。如果您拒绝提供邮箱信息，将可能无法接收到我们发送的消息通知。&nbsp;
</p>
<p>
    当您主动与我们联系时，我们需要您提供必要的个人信息以便核验您的用户身份。&nbsp;
</p>
<p>
    如果我们检测到可疑活动（例如尝试从不同于平常的位置登录您的账号）或违法违纪或有其他侵权行为时，可能会向您发送通知。
</p>
<p>
    我们可能会保存与您的沟通、通信、通话的记录，其中可能包含您的账号信息、订单信息、联系方式或其他个人信息。
</p>
<p>
    <br/>
</p>
<p>
    1.11 问卷调查
</p>
<p>
    为了更好地提供服务及改进服务质量的合理需要，我们可能通过给您发送邮件、发送短信或在数源三街平台推送消息等方式邀请您参与有关我们产品和服务的问卷调查，并收集您在调查中向我们发送的问卷答复信息。
</p>
<p>
    <br/>
</p>
<p>
    1.12 统计分析
</p>
<p>
    为了改进我们的服务，我们会在对您的个人信息进行匿名化或者去标识化处理后，进行研究、统计、分析和预测，以统计数据为基础改进我们的产品和服务，设计、开发、推广新产品及服务。
</p>
<p>
    <br/>
</p>
<p>
    1.13 另行征得同意
</p>
<p>
    请您理解，由于商业策略的变化，我们的产品和/或服务的功能也可能进行更迭和发展。如果我们要将您的个人信息用于本政策未载明的其他用途，或基于特定目的将收集而来的个人信息用于其他目的的，我们将会重新征得您的同意。
</p>
<p>
    1.14 征得授权同意的例外
</p>
<p>
    根据相关法律法规规定，我们在以下情况下收集、使用您的个人信息无需您的授权同意：
</p>
<p>
    &nbsp; &nbsp; （1）与我们履行法律、法规规定的义务相关的；
</p>
<p>
    &nbsp; &nbsp; （2）与国家安全、国防安全直接相关的；&nbsp;
</p>
<p>
    &nbsp; &nbsp; （3）与公共安全、公共卫生、重大公共利益直接相关的；&nbsp;
</p>
<p>
    &nbsp; &nbsp; （4）与犯罪侦查、起诉、审判和判决执行等司法或行政执法直接相关的；
</p>
<p>
    &nbsp; &nbsp; （5）出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
</p>
<p>
    &nbsp; &nbsp; （6）您自行向社会公众公开的个人信息；
</p>
<p>
    &nbsp; &nbsp; （7）从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；
</p>
<p>
    &nbsp; &nbsp; （8）根据与您签订和履行相关协议或其他书面文件所必需的；
</p>
<p>
    &nbsp; &nbsp; （9）用于维护所提供的产品及/或服务的安全稳定运行所必需的，例如发现、处置产品及/或服务的故障；
</p>
<p>
    &nbsp; &nbsp; （10）法律法规规定的其他情形。&nbsp;
</p>
<p>
    <br/>
</p>
<p>
    1.15 停止运营
</p>
<p>
    如我们停止运营本平台或其中部分服务时，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知您，并对我们所持有的与已关停业务相关的个人信息进行删除或匿名化处理。&nbsp;
</p>
<p>
    &nbsp; &nbsp; &nbsp; &nbsp;
</p>
<p>
    <strong>二、我们如何使用Cookie及相关技术</strong>
</p>
<p>
    <strong><br/></strong>
</p>
<p>
    为确保网站正常运转，让您获得更轻松的访问体验，我们会在您的计算机或移动设备上存储名为Cookie的小数据文件。Cookie通常包含标识符、站点名称以及一些号码和字符。借助于Cookie，网站能够存储您的偏好等数据，为您提供更个性化的用户体验和服务，并改善我们的服务和用户体验。我们不会将Cookie用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或删除Cookie。您可以清除计算机上保存的所有Cookie，大部分网络浏览器都设有阻止Cookie的功能。但如果您这么做，在某些情况下可能会影响您安全访问我们的网站，并且需要在每一次访问我们的网站时亲自更改用户设置。
</p>
<p>
    &nbsp; &nbsp; &nbsp; &nbsp;
</p>
<p>
    <strong>三、我们如何共享、转让、公开披露您的个人信息</strong>
</p>
<p>
    <strong><br/></strong>
</p>
<p>
    3.1 共享
</p>
<p>
    我们不会与本平台公司以外的公司、组织和个人共享您的个人信息，但以下情况除外：
</p>
<p>
    &nbsp; &nbsp; （1）在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。共享个人信息的范围、目的等将在获取您的授权同意时说明展示；
</p>
<p>
    &nbsp; &nbsp; （2）在法定情形下的共享：我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。共享个人信息的范围将根据法律法规及相关行政或司法部门要求而定；
</p>
<p>
    &nbsp; &nbsp; （3）与我们的关联公司共享：您的个人信息可能会与我们的关联公司共享。我们只会共享必要的个人信息，且受本政策中所声明目的的约束。我们会要求与我们共享您的个人信息的关联公司按照本政策约定的方式存储、处理您的个人信息。在共享信息前，我们会进行商业上的合理审查，评估共享您的个人信息的合法性、正当性和必要性，并督促相关方按照法律规定和监管要求来处理您的信息。我们的关联公司如要改变个人信息的处理目的，将再次征求您的授权同意；
</p>
<p>
    &nbsp; &nbsp; （4）与合作伙伴共享：仅为实现本政策中声明的目的，我们可能会向合作伙伴等第三方共享您的账户信息、设备信息以及位置信息，以便我们委托授权合作伙伴为您提供某些服务，我们仅会出于本政策声明的合法、正当、必要、特定、明确的目的共享您的信息，授权合作伙伴只能接触到其实现服务所需信息，且我们将会通过协议要求其不得将此信息用于其他任何目的。我们的合作伙伴包括基础设施技术服务、支付服务、数据处理、视频技术服务的供应商。以及我们为了保护您和其他用户的财产安全，防止欺诈等违法活动和减少信用风险，可能会与其他公司和组织交换信息，但并不会违反本政策中所作的承诺而为获利目的出售、出租、共享或以其它方式披露您的个人信息。对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本政策以及其他任何相关的保密和安全措施来处理个人信息。我们还将通过技术检测、安全审计等方式确保其个人信息收集、使用行为符合法律法规和约定要求；
</p>
<p>
    &nbsp; &nbsp; （5）为实现本政策所述目的，我们的产品或服务中会接入一些第三方插件（例如软件工具开发包（SDK）、应用程序接口（API）），以支持我们产品或服务的特定功能。为此，我们需要与该等第三方共享或传输特定个人信息，该等第三方SDK亦可能通过我们的App直接向您采集个人信息。如您希望了解第三方插件的具体情况，请访问SDK目录。我们会定期或不定期地对该等合作伙伴或服务提供商进行技术检测和行为审计，并要求其遵循合作协议，最大限度地确保其依法、依规、依约收集和使用数据。
</p>
<p>
    <br/>
</p>
<p>
    3.2 转让
</p>
<p>
    我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
</p>
<p>
    &nbsp; &nbsp; （1）事先获得您明确的同意或授权；
</p>
<p>
    &nbsp; &nbsp; （2）在发生收购、合并、破产清算时，如涉及到您的个人信息转移，我们将向您告知接收方的名称或者姓名和联系方式。同时，我们会要求新的持有您个人信息的公司、组织继续受本政策的约束，否则我们将要求该公司、组织和个人重新向您征求授权同意。
</p>
<p>
    <br/>
</p>
<p>
    3.3 公开披露
</p>
<p>
    我们仅会在以下情况下，公开披露您的个人信息：
</p>
<p>
    &nbsp; &nbsp; （1）获得您明确同意后；
</p>
<p>
    &nbsp; &nbsp; （2）根据法律、法规的要求、强制性的行政执法或司法要求所必须提供您个人信息的情况下，我们可能会依据所要求的个人信息类型和披露方式公开披露您的个人信息。在符合法律法规的前提下，当我们收到上述披露信息的请求时，我们会要求必须出具与之相应的法律文件，如传票或调查函。
</p>
<p>
    <br/>
</p>
<p>
    3.4 共享、转让、公开披露个人信息时事先征得授权同意的例外
</p>
<p>
    根据相关法律法规规定，以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：
</p>
<p>
    &nbsp; &nbsp; （1）与我们履行法律法规规定的义务相关的；
</p>
<p>
    &nbsp; &nbsp; （2）与国家安全、国防安全直接相关的；
</p>
<p>
    &nbsp; &nbsp; （3）与公共安全、公共卫生、重大公共利益直接相关的；
</p>
<p>
    &nbsp; &nbsp; （4）与刑事侦查、起诉、审判和判决执行等直接相关的；
</p>
<p>
    &nbsp; &nbsp; （5）出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人授权同意的；
</p>
<p>
    &nbsp; &nbsp; （6）您自行向社会公众公开的个人信息；
</p>
<p>
    &nbsp; &nbsp; （7）从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
</p>
<p>
    <br/>
</p>
<p>
    <strong>四、您对个人信息的权利</strong>
</p>
<p>
    <strong><br/></strong>
</p>
<p>
    按照中国相关的法律、法规、标准，您有权查询、复制、更正、删除您的个人信息，请求我们解释您的个人信息处理规则，以及改变您授权同意的范围、注销您的账号，并在法律法规规定的范围内，请求将您的个人信息转移至其指定的个人信息处理者。我们将保障您对自己的个人信息行使上述权利。在您使用本平台期间，您可以通过以下方式行使对您个人信息的权利。 但您理解并同意，您购买相关数字藏品后，您的购买者信息将记录在元数据中，作为您持有该数字藏品的凭证，该等购买者信息一经确认则不可篡改。
</p>
<p>
    <br/>
</p>
<p>
    4.1 访问您的个人信息
</p>
<p>
    您有权访问您的个人信息，您可以通过以下方式访问：
</p>
<p>
    访问个人主页。在本平台个人主页中访问您的手机号码、头像、性别、昵称，以及您的盲盒、收藏的作品、关注的创作家、参加的限时活动、账户余额和您的积分。
</p>
<p>
    <br/>
</p>
<p>
    4.2 更正您的个人信息
</p>
<p>
    您有权更正您的个人信息。为便于您更正您的个人信息，我们为您提供了在线自行更正方式。
</p>
<p>
    对于您的部分个人信息，您可以通过“访问您的个人信息”中的途径自行进行更正。
</p>
<p>
    <br/>
</p>
<p>
    4.3 删除您的个人信息
</p>
<p>
    如果您的账号有涉及违法、传播恶意信息、侵害平台或其他用户合法权益等行为，我们将删除或匿名化处理您的个人信息。当我们从服务器中删除您的个人信息后，我们可能不会立即从备份系统中删除相应的数据，但会在备份更新的时候删除这些信息。&nbsp;
</p>
<p>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
</p>
<p>
    4.4 其他个人信息权利
</p>
<p>
    您可以依法复制您的个人信息，要求我们解释您个人信息的处理规则，并在法律法规规定的范围内，请求将您的个人信息转移至指定的个人信息处理者。但请您注意，基于数字藏品版权保护要求，您无权要求我们向您提供数字藏品副本或将数字藏品转移至其他平台。
</p>
<p>
    <br/>
</p>
<p>
    4.5 响应您的上述请求
</p>
<p>
    为保障安全，您可能需要提供书面请求，或以其他方式证明您的身份。我们可能会先要求您验证自己的身份，然后才能处理您的请求。&nbsp;
</p>
<p>
    对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情况收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际（例如，涉及备份磁带上存放的信息）的请求，我们可能会予以拒绝。&nbsp;<br/>
</p>
<p>
    <br/>
</p>
<p>
    在以下情形中，按照法律法规要求，我们将无法响应您的请求：
</p>
<p>
    &nbsp; &nbsp; （1）与我们履行法律法规规定的义务相关的；
</p>
<p>
    &nbsp; &nbsp; （2）与国家安全、国防安全直接相关的；
</p>
<p>
    &nbsp; &nbsp; （3）与公共安全、公共卫生、重大公共利益直接相关的；
</p>
<p>
    &nbsp; &nbsp; （4）与刑事侦查、起诉、审判和执行判决等直接相关的；
</p>
<p>
    &nbsp; &nbsp; （5）有充分证据表明个人信息主体存在主观恶意或滥用权利的；
</p>
<p>
    &nbsp; &nbsp; （6）出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人授权同意的；
</p>
<p>
    &nbsp; &nbsp; （7）响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；
</p>
<p>
    &nbsp; &nbsp; （8）涉及商业秘密的。
</p>
<p>
    <br/>
</p>
<p>
    <strong>五、我们如何保护您的个人信息</strong>
</p>
<p>
    <strong><br/></strong>
</p>
<p>
    5.1 安全防护措施
</p>
<p>
    我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权访问、公开披露、使用、修改、损坏或丢失。我们会采取一切合理可行的措施，保护您的个人信息。例如，在您的浏览器与我们的服务之间交换数据时受SSL加密保护；我们同时对本平台提供https安全浏览方式；我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护机制防止数据遭到恶意攻击；我们会部署访问控制机制，确保只有授权人员才可访问个人信息。
</p>
<p>
    <br/>
</p>
<p>
    5.2 个人敏感信息加密传输和加密存储
</p>
<p>
    我们会对可识别的个人敏感信息进行加密传输和加密存储，加密强度符合安全要求，以确保数据的保密性。请您理解，互联网并非绝对安全的环境，而且电子邮件、即时通讯、及与其他用户的交流方式并未加密，因此我们强烈建议您不要通过此类方式发送敏感个人信息。&nbsp;
</p>
<p>

</p>
<p>
    5.3 信息安全事件响应
</p>
<p>
    我们将尽力确保您发送给我们的任何信息的安全性，但互联网环境并非百分之百安全，如果我们的物理、技术、或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改、或毁坏，导致您的合法权益受损，我们将承担相应的法律责任。在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们会及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。
</p>
<p>
    <br/>
</p>
<p>
    <strong>六、我们如何存储您的个人信息</strong>
</p>
<p>
    <br/>
</p>
<p>
    6.1 存储地点
</p>
<p>
    我们遵守法律法规的规定，境内运营中收集和产生的个人信息，将存储于境内。
</p>
<p>

</p>
<p>
    6.2 存储期限
</p>
<p>
    一般而言，我们仅为实现目的所必需的最短时间保留您的个人信息，超出必要期限后，我们将对您的个人信息进行删除或匿名化处理，但法律法规另有规定或者征得您另行授权同意的除外。
</p>
<p>
    如我们停止运营本平台及相关服务，我们将及时停止继续收集您个人信息的活动，并将以公告的形式进行停止运营通知，并对我们存储的个人信息进行删除或匿名化处理。
</p>
<p>

</p>
<p>
    <strong>七、未成年人个人信息保护</strong>
</p>
<p>
    <strong><br/></strong>
</p>
<p>
    我们非常重视对未成年人个人信息的保护。我们不会故意收集未成年人的个人信息，并且我们产品和服务的任何部分都不会面向未成年人。如果您是未满18周岁的未成年人，请不要以任何方式使用或访问我们的产品和服务。当我们得知我们无意中收集了未成年人的个人信息时，我们会根据适用的法律法规进行删除或采取其他合适的措施。
</p>
<p>

</p>
<p>
    <strong>八、对外提供</strong>
</p>
<p>
    <strong><br/></strong>
</p>
<p>
    我们的第三方合作伙伴会使用第三方SDK收集、使用您的个人信息。例如您通过部分手机厂商（如小米、华为、OPPO等品牌）的手机使用数源三街，我们接入的上述手机厂商Push SDK可能需要收集您的设备识别号、联网状态等信息用于实现产品信息的推送。
</p>
<p>
    我们不会对外公开披露所收集的个人信息，如必须公开披露时，我们会向您告知此次公开披露的目的、披露信息的类型及可能涉及的敏感信息，并征得您的明示同意。
</p>
<p>
    随着我们业务的持续发展，我们有可能进行合并、收购、资产转让等交易，我们将告知您相关情形，按照法律法规及不低于本隐私保护指引所要求的标准继续保护或要求新的控制者继续保护您的个人信息。
</p>
<p>
    另外，根据相关法律法规及国家标准，以下情形中，我们可能会共享、转让、公开披露个人信息无需事先征得您的授权同意：
</p>
<p>
    &nbsp; &nbsp; • 与国家安全、国防安全直接相关的；
</p>
<p>
    &nbsp; &nbsp; • 与公共安全、公共卫生、重大公共利益直接相关的；
</p>
<p>
    &nbsp; &nbsp; • 与犯罪侦查、起诉、审判和判决执行等直接相关的；
</p>
<p>
    &nbsp; &nbsp; • 出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
</p>
<p>
    &nbsp; &nbsp; • 个人信息主体自行向社会公众公开个人信息的；
</p>
<p>
    &nbsp; &nbsp; • 从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
</p>
<p>
    <br/>
</p>
<p>
    <strong>九、本政策的更新</strong>
</p>
<p>
    <br/>
</p>
<p>
    为了给您提供更好的服务，我们的服务和技术将会不断进行优化和改进，我们会根据服务和技术的更新情况及法律法规的相关要求随时修改本政策。但未经您明确同意，我们不会限制您按照本政策所应享有的权利。&nbsp;
</p>
<p>
    对于重大变更，我们还会提供更为显著的通知，在本平台中进行公示。本政策所指的重大变更包括但不限于：&nbsp;
</p>
<p>
    &nbsp; &nbsp; （1）我们的服务模式发生重大变化。如处理个人信息的目的、处理个人信息的类型、个人信息的使用方式等；
</p>
<p>
    &nbsp; &nbsp; （2）我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；
</p>
<p>
    &nbsp; &nbsp; （3）个人信息共享、转让或公开披露的主要对象发生变化；
</p>
<p>
    &nbsp; &nbsp; （4）您对个人信息的权利及其行使方式发生重大变化；
</p>
<p>
    &nbsp; &nbsp; （5）我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；
</p>
<p>
    &nbsp; &nbsp; （6）个人信息安全影响评估报告表明存在高风险时；
</p>
<p>
    &nbsp; &nbsp; （7）其他重要的或可能严重影响您的个人权益的情况发生时。
</p>
<p>
    <br/>
</p>
<p>
    任何修改都会将您的满意度置于首位。我们鼓励您在每次访问本平台时都查阅我们的个人信息保护政策。
</p>
<p>
    <br/>
</p>`
		}
  },
  onShow() {
    //设置页面title
    document.title='隐私政策'
  }
}
</script>

<style scoped lang="scss">
@import "static/css/variable";
.title-box {
  height: 54rpx;
  color: rgb(51, 51, 51);
  line-height: 54rpx;
  text-align: center;
}

.content-wrapper {
  line-height: 42rpx;
  margin-top: 46rpx;
  color: rgb(102, 102, 102);
}
.fc-7f{
  color: #7F7F7F;
}
.mt-80{
  margin-top: 80rpx;
}
</style>
