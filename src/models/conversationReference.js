function referenceToData(reference) {
  return {
    user_id: reference.user.id,
    user_name: reference.user.name,
    user_aadobjectid: reference.user.aadObjectId,
    bot_id: reference.bot.id,
    bot_name: reference.bot.name,
    conversation_conversationtype: reference.conversation.conversationType,
    conversation_tenantid: reference.conversation.tenantId,
    conversation_id: reference.conversation.id,
    channelid: reference.channelId,
    locale: reference.locale,
    serviceurl: reference.serviceUrl,
    member_id: reference.member.id,
    member_name: reference.member.name,
    member_objectid: reference.member.objectId,
    member_givenname: reference.member.givenName,
    member_surname: reference.member.surname,
    member_email: reference.member.email,
    member_userprincipalname: reference.member.userPrincipalName,
    member_tenantid: reference.member.tenantId,
    member_userrole: reference.member.userRole,
    member_aadobjectid: reference.member.aadObjectId
  };
}

function dataToReference(data) {
  return {
    user: {
      id: data.user_id,
      name: data.user_name,
      aadObjectId: data.user_aadobjectid
    },
    bot: {
      id: data.bot_id,
      name: data.bot_name
    },
    conversation: {
      conversationType: data.conversation_conversationtype,
      tenantId: data.conversation_tenantid,
      id: data.conversation_id
    },
    channelId: data.channelid,
    locale: data.locale,
    serviceUrl: data.serviceurl,
    member: {
      id: data.member_id,
      name: data.member_name,
      objectId: data.member_objectid,
      givenName: data.member_givenname,
      surname: data.member_surname,
      email: data.member_email,
      userPrincipalName: data.member_userprincipalname,
      tenantId: data.member_tenantid,
      userRole: data.member_userrole,
      aadObjectId: data.member_aadobjectid
    }
  };
}

module.exports = {
  referenceToData,
  dataToReference
};