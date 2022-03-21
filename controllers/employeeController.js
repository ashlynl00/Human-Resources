const Employee = require("../models/employee")
const User = require('../models/user');
const express = require('express');
const router = express.Router();

///to serve files ie pdfs
const path = require("path");
const fs = require("fs");
// const dirPath = path.join(__dirname, "public/pdfs");

// INDEX: GET
// /employees
// Gives a page displaying all the employees
router.get('/', async (req, res)=>{
    if(!req.session.visits){
        req.session.visits = 1;
    }else{
        req.session.visits += 1
    }
    if (User.companyID == Employee.companyID) {
        let employeeCompanyId = res.locals.companyID;
        console.log(res.locals);
        const employees = await Employee.find({companyID: employeeCompanyId});
        console.log(employees);
        // Demo that res.locals is the same as the object passed to render
        res.locals.visits = req.session.visits;
        res.locals.employees = employees;
        res.render('employees/index.ejs')
    }
})

///to interact with pdfs
const files = fs.readdirSync('public/pdfs').map(name => {
    return {
      name: path.basename(name, ".pdf"),
      url: `/pdfs/${name}`
    };
  });

///for the forms tab
router.get('/forms', async (req, res)=>{
    res.render("forms.ejs", {files})
})



// NEW: GET
// /employees/new
// Shows a form to create a new employee
router.get('/new', async (req, res)=>{
    const currentUser = await User.findById(req.session.userId)
    res.render('employees/new.ejs', {
        currentUser: currentUser
    })
})

// SHOW: GET
// /employees/:id
// Shows a page displaying one employee
router.get('/:id', async (req, res)=>{
    const employee = await Employee.findById(req.params.id).populate('user')
    res.render("employees/show.ejs", {
        employee: employee
    })
})

// CREATE: POST
// /employees
// Creates an actual employee, then...?
router.post('/', async (req, res)=>{
    req.body.user = req.session.userId
    const newEmployee = await Employee.create(req.body);
    console.log(newEmployee)
    res.redirect('/employees')
})

// EDIT: GET
// /employees/:id/edit
// SHOW THE FORM TO EDIT A EMPLOYEE
router.get('/:id/edit', async (req, res)=>{
    try{
        const employee = await Employee.findById(req.params.id)
        res.render('employees/edit.ejs', {
            employee: employee
        })
    }catch(err){
        res.sendStatus(500)
    }
})

// UPDATE: PUT
// /employees/:id
// UPDATE THE EMPLOYEE WITH THE SPECIFIC ID
router.put('/:id', async (req, res)=>{
   try{
        await Employee.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/employees/${req.params.id}`)
   }catch(err){
        res.sendStatus(500)
   }
})
// DELETE: DELETE
// /employees/:id
// DELETE THE EMPLOYEE WITH THE SPECIFIC ID
router.delete('/:id', async (req, res)=>{
    try{
        await Employee.findByIdAndDelete(req.params.id)
        res.redirect('/employees')
    }catch(err){
        res.sendStatus(500)
    }
})



module.exports = router;