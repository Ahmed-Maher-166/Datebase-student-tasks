
const express = require ('express')
const Students = require('../models/student')
const auth = require('../middleware/auth')
const router = express.Router()
router.post('/students' ,(req , res) => {
    const student = new Students(req.body)
    student.save().then ((student) => {res.status(200).send(student)}).catch((e)=>{ res.status(400).send(e)})
})

router.get('/students',auth ,(req , res) => {
    Students.find().
    then(((users)=>{
        res.status(200).send(users)
    })).
    catch((e)=>{
        res.status(500).send(e)
    })
})
router.get('/students/:id',auth ,(req , res) => {
   const id = req.params.id
   Students.findById(id).
   then((student)=>{
      if(!student) return res.status(404).send('Unable to find user')
      res.status(200).send(student)
   }).
   catch((e)=>{ res.status(500).send(e)})
})


router.patch('/students/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id
        const user = await Students.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        })
        if(!user){
            return res.status(404).send('No user is found')
        }
        res.status(200).send(user)
    }
    catch(error){
        res.status(400).send(error)
    }
})




router.delete('/students/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id
        const user = await Students.findByIdAndDelete(id)
        if(!user){
           return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
    })

    router.post('/login',async(req,res)=>{
        try{
            const user = await Students.findByCredentials(req.body.email,req.body.password)
            const token = await user.generateToken()
            res.status(200).send({ user , token})
        }
        catch(e){
            res.status(400).send(e.message)
        }
    })
    
    /////////////////////////////////////////////////////////////////////////////////////////////
    
      router.post ('/students' , async (req , res) => {
        try {
            const user = new Students (req.body)
            const token = await user.generateToken()
            await user.save()
             res.status(200).send({user , token})
        } catch (e) {
            res.status(400).send(e)
        }
    })
    ///////////////////////////////////////////////////////////////////////////////////////////
    // Profile : 
    router.get('/profile',auth,async(req,res)=>{
        res.status(200).send(req.user)
    })
    //////////////////////////////////////////////////////////////////////////////////////////
    
    // logout :
    router.delete('/logout',auth,async(req,res)=>{
        try{
            console.log(req.user)
            req.user.tokens = req.user.tokens.filter((el)=>{
                return el !== req.token
            })
            await req.user.save()
            res.send()
        }
        catch(e){
            res.status(500).send(e)
        }
    })
    ////////////////////////////////////////////////////////////////////////////////////////////
    // logoutall :
    
    router.delete('/logoutAll',auth,async(req,res)=>{
        try{
            req.user.tokens = []
            await req.user.save()
            res.send()
        }
        catch(e){
            res.status(500).send(e)
        }
    })
/////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router 
