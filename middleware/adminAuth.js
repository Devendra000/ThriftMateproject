const isLoggedIn = async(req,res,next)=>{
    try {
        if(!req.session.email){
            res.redirect('/admin')
        }
        else{
            console.log(req.session.email)
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
}

const isLoggedOut = async(req,res,next)=>{
    try {
        if(req.session.email){
            res.redirect('/admin/home')
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { 
    isLoggedIn,
    isLoggedOut
}