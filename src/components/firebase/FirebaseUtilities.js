import { myDatabase } from './firebase'

// export function login(email,password){
//     myFirebase.auth().signInWithEmailAndPassword(email,password)
// }


export async function createNewSite(site){
    await myDatabase.collection('sites').add({
      name: site.name,
      city: site.city,
      country: site.country,
      tags: site.tags,
      adress: site.adress,
      externalSourceUrl: site.externalSourceUrl,
      imageUrl: site.imageUrl,
      fullInfo: site.fullInfo,
      partialInfo: site.partialInfo,
      latitude: site.latitude,
      longitude: site.longitude
    })
}

export async function UpdateSite(site){
    await myDatabase.collection('sites').doc(site.id).update({
      name: site.name,
      city: site.city,
      country: site.country,
      tags: site.tags,
      adress: site.adress,
      externalSourceUrl: site.externalSourceUrl,
      imageUrl: site.imageUrl,
      fullInfo: site.fullInfo,
      partialInfo: site.partialInfo,
      latitude: site.latitude,
      longitude: site.longitude
    })
}


export async function DeleteSiteFromDB(site){
    await myDatabase.collection('sites').doc(site.id).delete();
}


export async function getUserClaims(user){
    if(!user){
        return "guest"
    }
    let userClaims = "registered"
    var tokenResult = await user.getIdTokenResult()
    user.admin = tokenResult.claims.admin;
    if (user.admin) {
        userClaims = "admin"
    } else {
        console.log("is registered")
        userClaims = "registered"
    }
    return userClaims;
}

export async function getFavoritesIDs(userid) {
    const user = await myDatabase.collection('accounts').doc(userid).get()
    return user.data().favorites
}

export async function getFavorites(userid){
    var resultOfSite = []
    var siteList = await getFavoritesIDs(userid)
    var id = 0
    // console.log(siteList);
    for (const site of siteList){
        const siteFromFireStore = await myDatabase.collection('sites').doc(site).get();
        var getData = siteFromFireStore.data();
        // console.log(getData);
        resultOfSite.push({
            tags: getData.tags,
            name: getData.name,
            city: getData.city,
            country: getData.country,
            id: id,
            uid: site
        })
        id +=1;
    }
    return resultOfSite;
}

export async function updateUserFavorites(userid, newFavorites) {
    await myDatabase.collection('accounts').doc(userid).update({
        'favorites': newFavorites
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
}

export async function getSiteByID(siteid) {
    return  (await myDatabase.collection('sites').doc(siteid).get()).data()
}

export async function createNewRoad( {siteListID,roadName,roadDescription} ){
    await myDatabase.collection('roads').add({
        roadName: roadName,
        description: roadDescription,
        siteList: siteListID,
    })
}