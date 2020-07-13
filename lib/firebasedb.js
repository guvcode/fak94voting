import admin from 'firebase-admin';

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: "fak94-alumni",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCf23I+3+HqI+mN\nc/zXUFL4/RCucPG8XhR4i8/qry1ptH/QVulMp0dS6iT6KdRVgfAaWoiy45efWOpG\nodYhh3g7VvSyTG43vTJG3Ylg/0ErGJbRfF4N+gmtm8cnheDMnrmRa3id3TcCRlbL\npActNaSxdSGoxuf4imiiQaZtnOLTF/QeH0SSLhGZh6haHyN47LpBtTg2dLf56uNg\ncLUlKpq0E4/Ezr5o1K1tDDHsgHVotm9Q8OD43rzdnINDzo9P8Wc4XkkHbj9NS2lZ\nuAiqlPN26jsk96+1hU1laVNPomtDCrXiaH120Lp1+JNCHsnanSWIWkN2WZWRWx2a\n/hGfBRYzAgMBAAECggEACFd0rjg+OzAVjgvpO+O/+KiH+CUCUEXeg+3TyIIh+LFH\nttDviqWd+1h8MSZWo1b3oasWFV5P+VYz9MHu1mq8c5Lq4OpLxBKA2aF80OLGUp/i\nsDAbs6ytAvICjJrtVfAgbH4IWhXYOtZTItGT4vWOJbPK26+ex4w9aojKIk/R/EQ0\nxbKBMhpdBjWAOYxsrPYVVye0A/7+/IPPc1mBIThldasyGnEkS5i0d/9Q0rBthG0l\nTSHnAjlAJ64yn2MOVrz+amnwa+qefCngaJiutgt5ukkw5gAUEUOuRfZ+JXNuDjzy\niuA0pMtSSKDxzdgBsLE5D7fdZACOS+sXppofzM0CgQKBgQDOoD8aPpNCz430ckb8\nNiZEt6H2VZ4ozmv2pXd9WyJHLcWtoroi++U7IF/HYyO8OAYACutFiGdCANjGVCmq\ntcHHvb3mkUrM8PesOz6h1tLZaPlZ0M8DD+KNKxiT8VtM9NdYZzmie7CRYEaoeUuH\nHxcqOaf3hZR+J39hgMG+quV8swKBgQDGDkFDchecTf9Cd8vo7PTsS5p5e4FV2m2M\nQ7qdGroWNiUtjd6OBUuQ8EDPPpLEesku1n53aTYJ5SjfagKcLj3b+7Q/I7rXP1FW\ngQRp9EURxo7XLwgE3aXhLeTlDP1IkytI1XFKOBmBO643erNhnwvuvFsN+yERo5G7\nprj04DnAgQKBgQC9Kmn6/fTVwq0EcSbZuj1YxgFqQ0ITu7+NxDjbs/Zy0c3bRFJC\nuvhHJEFrijDqHSQpH9X7B4D5JUtQbzbiSZpJ4kUb9EJV0/n7XRXfFoxcbEV0W71Z\n4U4Yza6nqtxaXQFVttNGFRU2Urz9emaSIv2TM8u5yTqEMGbm/fjiNRT6DwKBgQC+\n3Pvt+GRigBPvRS1f0gMSOKWsTuZMC0yo8JhFUH1mbFWVufNw4A97pNyAHCgqar24\ngoKrptup24pxC2NqiXGZrs58Tn1/c4h6GalcRkfNopEDNFLBBa0W/ThpuAPazeDX\ntsIPqVKC5TW2R2vZNwGz1xbUuV+b9Qq7USdK7U8agQKBgCDESZgKNrECOfTH+V1+\nn0BH5RaY9PuSikOODS3BUEDK90r39SfLH+wjs91nnOUiQAI4UfKMq+7lHkgH4TI9\nl36sHcWttIWlOi5EPGGJiCcNqN7f6WVJztEi5QoHSC2fu/5cTTjDucaA1L71a7vV\nk1cGxbJx8JqoIwKz5uHbUPUb\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-4y4vc@fak94-alumni.iam.gserviceaccount.com"
      /*project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL
      */
    }),
    databaseURL: 'https://fak94-alumni.firebaseio.com'
  });
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin.firestore();