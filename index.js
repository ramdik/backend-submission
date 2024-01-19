const express = require("express")
const { PrismaClient } = require("@prisma/client")
const bcrypt = require('bcrypt');
const app = express()
const cors = require("cors")


app.use(express.json())
app.use(cors())
const prisma = new PrismaClient()

// Users tabel
// get data users
app.get("/users", async (req,res) => {
    const result = await prisma.user.findMany()
    res.send(result)
})

// create new user
app.post("/users", async (req, res)=> {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10) //hash PW before store to DB
    const result = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
    console.log(result)
    res.send(result)
})

/* weddingOffer section */
app.get("/wedding-offers", async (req,res) => {
    const result = await prisma.weddingOffer.findMany()
    res.send(result)
})

// get data weddingOffer with user id
app.get("/wedding-offers/:userId", async (req,res) => {
    const { userId } = req.params
    const result = await prisma.weddingOffer.findMany({
        where: {
            userId: parseInt(userId)
        }
    })
    console.log(result)
    res.send(result)
})

// get data weddingOffer with user data, and weddingOffer user have data
app.get("/wedding-offers/:userId/:id", async (req,res) => {
    const { userId, id } = req.params
    const result = await prisma.weddingOffer.findMany({
        where: {
            userId: parseInt(userId),
            id: parseInt(id)
        }
    })
    console.log(result)
    res.send(result)
})

//store weddingOffer data with id user reference
app.post("/wedding-offers", async (req, res)=> {
    const { userId, weddingOfferName, weddingOfferAuthor, weddingOfferPrice, weddingOfferDescription, weddingOfferImg } = req.body
    const result = await prisma.weddingOffer.create({
        data: {
            userId,
            weddingOfferName,
            weddingOfferAuthor,
            weddingOfferPrice: parseInt(weddingOfferPrice),
            weddingOfferDescription,
            weddingOfferImg
        }
    })
    console.log(result)
    res.send(result)
})

// update data weddingOffer with user id, and weddingOffer id reference
app.put("/wedding-offers/:userId/:id", async (req, res)=> {
    const { id, userId } = req.params
    const { weddingOfferName, weddingOfferAuthor, weddingOfferPrice, weddingOfferDescription, weddingOfferImg } = req.body
    const result = await prisma.weddingOffer.update({
        where: {
            id: parseInt(id),
            userId: parseInt(userId)
        },
        data: {
            weddingOfferName,
            weddingOfferAuthor,
            weddingOfferPrice,
            weddingOfferDescription,
            weddingOfferImg
        }
    })
    console.log(result)
    res.send(result)
})

// delete offer
app.delete('/wedding-offers/:userId/:id', async (req, res) => {
    const { userId, id } = req.params;
  
    try {
      const deletedWeddingOffer = await prisma.weddingOffer.delete({
        where: {
          userId: parseInt(userId),
          id: id,
        },
      });
  
      res.json({ message: 'Wedding offer deleted successfully', deletedWeddingOffer });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


app.listen(3000, ()=>{
    console.log("Server On at PORT 3000")
})