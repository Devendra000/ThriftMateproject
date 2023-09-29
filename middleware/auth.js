const isLoggedIn = async(req,res,next)=>{
    try {
        if(!req.session.email){
            res.redirect('/login');
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
}

const isLoggedOut = async(req,res,next)=>{
    try {
        if(req.session.email){
            res.redirect('/homepage')
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