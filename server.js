const express=require('express')
const {open}=require('sqlite')
const sqlite3=require('sqlite3')
const cors=require('cors')

const app=express()
const path=require('path')

let db=null

app.use(cors(
    {
        origin:'https://book-management-frontend-2829.vercel.app',
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type']
    }
))

app.use(express.json())

const dbPath=path.join(__dirname,'booksdatabase.db')

const initiateAndStartDatabaseServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3000,()=>{
            console.log('Server is running at http://localhost:3000/')
        })
    }catch (e){
        console.log(`DB Error : ${e.message}`)
        process.exit(1)
    }
}


initiateAndStartDatabaseServer()


app.get('/books',async(req,res)=>{
    try{
        const booksQuery=`select * from books;`
        const response=await db.all(booksQuery)
        res.status(200).json({response})
    }catch(e){
        console.log(`error: ${e.message}`)
        res.status(501).json('internal server error')
    }
})

app.post('/books', async(req,res)=>{
    const {title,authorId,genreId,pages,publishedDate}=req.body
    try{
        const insertQuery=`insert into books (title,author_id,genre_id,pages,published_date)
        values (?,?,?,?,?)`
        await db.run(insertQuery,[title,authorId,genreId,pages,publishedDate])
        res.status(201).json({message:'data inserted successfully'})
    }catch (e){
        console.error('Error while inserting', e)
        res.status(501).json({message:'Failed to Insert the data'})
    }
})

app.delete('/books/:id',async(req,res)=>{
    const {id}=req.params
    try{
        bookDeleteQuery=`delete from books where book_id=?;`
        await db.run(bookDeleteQuery,[id])
        res.status(201).json({message:'book deleted successfully'})
    }catch (e){
        console.error('Error while inserting', e)
        res.status(501).json({message:'Failed to Delete the book'})
    }
})


app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, authorId, genreId, pages, publishedDate } = req.body;

    try {
        // Dynamically build the SET clause
        const fieldsToUpdate = [];
        const values = [];

        if (title) {
            fieldsToUpdate.push('title = ?');
            values.push(title);
        }
        if (authorId) {
            fieldsToUpdate.push('author_id = ?');
            values.push(authorId);
        }
        if (genreId) {
            fieldsToUpdate.push('genre_id = ?');
            values.push(genreId);
        }
        if (pages) {
            fieldsToUpdate.push('pages = ?');
            values.push(pages);
        }
        if (publishedDate) {
            fieldsToUpdate.push('published_date = ?');
            values.push(publishedDate);
        }

        // Check if there are fields to update
        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Add the book ID to the values array for the WHERE clause
        values.push(id);

        // Construct the SQL query
        const bookUpdateQuery = `
            UPDATE books 
            SET ${fieldsToUpdate.join(', ')}
            WHERE book_id = ?;
        `;

        await db.run(bookUpdateQuery, values);

        res.status(200).json({ message: 'Book updated successfully' });
    } catch (e) {
        console.error('Error while updating', e);
        res.status(500).json({ message: 'Failed to update the book' });
    }
});



module.exports = app;