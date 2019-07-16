authCuentaFacebook(){
const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result=>{
        $('#avatar').attr('src',result.user.photoURL)        
        $('.modal').modal('close')
        Materialize.toast('Bienvenido ${result.user.displayName}',4000)
    })
    .cath(error=>{
        console.error(error)
        Materialize.toast('Error en la autenticación',4000)
    })
}
authCuentaGoogle(){

}