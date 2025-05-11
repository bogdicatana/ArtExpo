const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const { accountDB, exhibitionDB } = require('./db');

const app = express()

const fileUpload = require('express-fileupload')
const path = require('path')

const artImages = path.join(__dirname, './art_images')

const fs = require('fs')
const { unlink } = require('fs')

app.use(express.json())
app.use(fileUpload())

app.post('/signup', (req, res) => {

    const checkEmailSql = "SELECT COUNT(*) AS count FROM accounts WHERE email = ?"
    accountDB.get(checkEmailSql, [req.body.email], (err, row) => {
        if (err) {
            console.error('Error checking email:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        if (row.count > 0) {
            res.json({message: 'email'})
            return
        }
        const checkUsernameSql = "SELECT COUNT(*) AS count FROM accounts WHERE username = ?"
        accountDB.get(checkUsernameSql, [req.body.username], (err, row) => {
            if (err) {
                console.error('Error checking unsername:', err.message)
                res.status(500).json({message: 'Internal server error'})
                return
            }
            if (row.count > 0) {
                res.json({message: 'username'})
                return
            }

            const insertSql = "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)"
            accountDB.run(insertSql, [req.body.username, req.body.password, req.body.email], function(err) {
                if (err) {
                    console.error('Error inserting account:', err.message)
                    res.status(500).json({message: 'Internal server error'})
                    return
                }
                console.log(`A new account has been added with ID ${this.lastID}`)
                res.json({message: 'success', accountID: this.lastID})
            })
        })
    })
})

app.post('/login', (req, res) => {
    const checkAccountSql = "SELECT COUNT(*) AS count, id AS ID FROM accounts WHERE username = ? AND password = ?"
    accountDB.get(checkAccountSql, [req.body.username, req.body.password], (err, row) => {
        if (err) {
            console.error('Error checking account:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        if (row.count === 0) {
            res.json({message: 'failed login'})
            return
        }
        res.json({message: 'success', accountID: row.ID}) // we would need to send some info here about the account and stuff back to the client after a successfull login to setup the next page
    })
})

app.post('/artworkFormUpload', (req, res) => {
    const { image } = req.files
    try{
        image.mv(path.join(artImages, image.name))
        const artworkData = {
            title: req.body.title,
            description: req.body.description,
            artist: req.body.artist,
            medium: req.body.medium,
            year: req.body.year,
            exhibition: req.body.exhibition,
            imageUrl: `/art_images/${image.name}`,
            aspectRatio: req.body.aspectRatio
        }
        const insertArtworkSql = "INSERT INTO Artworks (imageFilePath, artist, description, exhibitionID, title, year, medium, aspectRatio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        exhibitionDB.run(insertArtworkSql, [artworkData.imageUrl, artworkData.artist, artworkData.description, artworkData.exhibition, artworkData.title, artworkData.year, artworkData.medium, artworkData.aspectRatio], function(err) {
            if (err) {
                console.error('Error inserting artwork:', err.message)
                res.status(500).json({message: 'Internal server error'})
                return
            }
            console.log(`A new artwork has been added with ID ${this.lastID}`)
        })
        res.json({message: 'success'})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

app.post('/exhibitionCreation', (req, res) => {
    const exhibitionData = {
        name: req.body.exhibitionName,
        location: req.body.exhibitionLocation,
        startDate: req.body.exhibitionStartDate,
        endDate: req.body.exhibitionEndDate,
        organizerID: req.body.organizerID,
        startTime: req.body.exhibitionStartTime,
        endTime: req.body.exhibitionEndTime
    }
    const checkNameSql = "SELECT COUNT(*) AS count FROM Exhibitions WHERE name = ?"
    exhibitionDB.get(checkNameSql, [req.body.username], (err, row) => {
        if (err) {
            console.error('Error checking name:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        if (row.count > 0) {
            res.json({message: 'Exhibition name already exists'})
            return
        }

        const insertSql = "INSERT INTO Exhibitions (name, location, startDate, endDate, organizerID, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?, ?)"
        exhibitionDB.run(insertSql, [exhibitionData.name, exhibitionData.location, exhibitionData.startDate, exhibitionData.endDate, exhibitionData.organizerID, exhibitionData.startTime, exhibitionData.endTime], function(err) {
            if (err) {
                console.error('Error inserting exhibition:', err.message)
                res.status(500).json({message: 'Internal server error'})
                return
            }
            console.log(`A new exhibition has been added by account ID ${exhibitionData.organizerID} with ID ${this.lastID}`)
            res.json({message: 'success', exhibitID: this.lastID})
        })
    })
})

app.post('/getExhibitions', (req, res) => {
    const getExhibitionsSql = "SELECT * FROM Exhibitions WHERE organizerID = ?"
    exhibitionDB.all(getExhibitionsSql, [req.body.organizerID], (err, rows) => {
        if (err) {
            console.error('Error getting exhibitions:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        res.json(rows)
    })
})

app.post('/deleteArtwork', (req, res) => {
    const { artworkID } = req.body;

    const searchDeleteFiles = "SELECT imageFilePath FROM Artworks WHERE imageID = ?";
    exhibitionDB.all(searchDeleteFiles, [artworkID], (err, rows) => {
        if (err) {
            console.error('Error getting artworks:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        rows.forEach(row => {
            const filePath = row.imageFilePath.replace('/art_images/', '');
            unlink(path.join(artImages, filePath), (err) => {
                if (err) {
                    console.error('Error deleting file:', err)
                }
            })
        })
    })

    const deleteSql = "DELETE FROM Artworks WHERE imageID = ?";
    exhibitionDB.run(deleteSql, [artworkID], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        console.log(`Rows affected: ${this.changes}`);
        if (this.changes > 0) {
            res.json({ success: true, message: 'Artwork succesfully deleted'});
        } else {
            res.status(404).json({ success: false, message: 'Artwork not found' });
        }
    });
})

app.post('/deleteExhibition', (req, res) => {
    const { exhibitionID } = req.body;

    const deleteSql = "DELETE FROM Exhibitions WHERE id = ?";
    exhibitionDB.run(deleteSql, [exhibitionID], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        console.log(`Rows affected: ${this.changes}`);
        if (this.changes > 0) {
            res.json({ success: true, message: 'Exhibition succesfully deleted'});
            const searchDeleteFiles = "SELECT imageFilePath FROM Artworks WHERE exhibitionID = ?";
            exhibitionDB.all(searchDeleteFiles, [exhibitionID], (err, rows) => {
                if (err) {
                    console.error('Error getting artworks:', err.message)
                    res.status(500).json({message: 'Internal server error'})
                    return
                }
                rows.forEach(row => {
                    const filePath = row.imageFilePath.replace('/art_images/', '');
                    unlink(path.join(artImages, filePath), (err) => {
                        if (err) {
                            console.error('Error deleting file:', err)
                        }
                    })
                })
            })
            const deleteSqlArtworks = "DELETE FROM Artworks WHERE exhibitionID = ?";
            exhibitionDB.run(deleteSqlArtworks, [exhibitionID], function(err) {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                console.log(`Rows affected: ${this.changes}`);
            });
            const deleteSqlTickets = "DELETE FROM tickets WHERE exhibitID = ?";
                accountDB.run(deleteSqlTickets, [exhibitionID], function(err) {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ success: false, message: 'Database error' });
                    }
                    console.log(`Rows affected: ${this.changes}`);
                })
        } else {
            res.status(404).json({ success: false, message: 'Exhibition not found' });
        }
    });
});

app.use('/art_images', express.static(artImages))

app.post('/getArtworks', (req, res) => {
    const getArtworksSql = "SELECT * FROM Artworks WHERE exhibitionID = ?"
    exhibitionDB.all(getArtworksSql, [req.body.exhibitID], (err, rows) => {
        if (err) {
            console.error('Error getting artworks:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        res.json(rows)
    })
})

app.post('/editArtwork', (req, res) => {
    const { artworkID, title, description, artist, medium, year, imageUpdated, aspectRatio } = req.body
    var imageFileName
    if(imageUpdated === "true"){
        const {image} = req.files
        image.mv(path.join(artImages, image.name))
        imageFileName = `/art_images/${image.name}`
        const filePath = req.body.oldImage.replace('/art_images/', '');
        unlink(path.join(artImages, filePath), (err) => {
            if (err) {
                console.error('Error deleting file:', err)
            }
        })
    } else {
        const {image} = req.body
        imageFileName = image
    }
    const updateSql = "UPDATE Artworks SET title = ?, description = ?, artist = ?, medium = ?, year = ?, imageFilePath = ?, aspectRatio = ? WHERE imageID = ?"
    exhibitionDB.run(updateSql, [title, description, artist, medium, year, imageFileName, aspectRatio, artworkID], function(err) {
        if (err) {
            console.error('Error updating artwork:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        console.log(`Artwork with ID ${artworkID} has been updated`)
        res.json({message: 'success'})
    })
})

app.post('/getAllExhibitions', (req, res) => {
    const getExhibitionsSql = "SELECT * FROM Exhibitions"
    exhibitionDB.all(getExhibitionsSql, (err, rows) => {
        if (err) {
            console.error('Error getting exhibitions:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        res.json(rows)
    })
})


app.post('/getAllExhibitionsWithArtworks', (req, res) => {
    const sql = `
    SELECT
      e.*,
      (
        SELECT a.imageFilePath
        FROM Artworks a
        WHERE a.exhibitionID = e.id
        LIMIT 1
      ) AS imageFilePath
    FROM Exhibitions e
    ORDER BY e.startDate ASC
  `;

    exhibitionDB.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error with join:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(rows)
    })
})

app.post('/uploadTicket', (req, res) => {
    const insertSql = "INSERT INTO tickets (accountID, exhibitID) VALUES (?, ?)"
    accountDB.run(insertSql, [req.body.accountID, req.body.exhibitID], function(err) {
        if (err) {
            console.error('Error inserting ticket:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        console.log(`A new ticket has been added with ID ${this.lastID}`)
        res.json({message: 'success'})
    })
})

app.post("/searchExhibitions", (req, res) => {
    const searchTerm = req.body.searchTerm || ""
    const likeTerm = `%${searchTerm}%`;

    const searchSql = "SELECT * FROM Exhibitions WHERE name LIKE ? OR location LIKE ?"

    exhibitionDB.all(searchSql, [likeTerm, likeTerm], (err, rows) => {
        if (err) {
            console.error('Error searching exhibitions:', err.message)
            res.status(500).json({message: 'Internal server error'})
            return
        }
        res.json(rows)
    })
})

app.post("/refundTicket", (req, res) => {
    const { accountID, exhibitID } = req.body

    const deleteSql = "DELETE FROM tickets WHERE accountID = ? AND exhibitID = ?"
    accountDB.run(deleteSql, [accountID, exhibitID], function(err) {
        if (err) {
            console.error('Database error:', err)
            return res.status(500).json({ success: false, message: 'Database error' })
        }

        console.log(`Rows affected: ${this.changes}`)
        if (this.changes > 0) {
            res.json({ success: true, message: 'Ticket successfully refunded' })
        } else {
            res.status(404).json({ success: false, message: 'Ticket not found' })
        }
    })
})

app.post('/getCalendarExhibitions', (req, res) => {
    const sql = `
      SELECT
        id,
        name AS title,  -- rename if you want a "title" field
        startDate,
        endDate,
        startTime,
        endTime,
        location
      FROM Exhibitions
      ORDER BY startDate ASC
    `;

    exhibitionDB.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error fetching calendar exhibitions:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(rows);
    });
});

app.post('/checkTicket', (req, res) => {
    const sql = "SELECT * FROM tickets WHERE accountID = ? AND exhibitID = ?"
    accountDB.all(sql, [req.body.accountID, req.body.exhibitID], (err, rows) => {
        if (err) {
            console.error('Error with join:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({message: rows.length > 0 ? "ticket" : "no ticket"})
    })
})


app.post('/getExhibitionsWithTicket', (req, res) => {
    const sql = "SELECT * FROM tickets WHERE accountID = ?"
    accountDB.all(sql, [req.body.accountID], (err, rows) => {
        if (err) {
            console.error('Error with join:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const sql2 = "SELECT * FROM Exhibitions WHERE id = ?";
        const exhibitionPromises = rows.map(row => {
            return new Promise((resolve, reject) => {
                exhibitionDB.all(sql2, [row.exhibitID], (err, rows2) => {
                    if (err) {
                        console.error('Error with join:', err);
                        return reject(err);
                    }
                    resolve(rows2[0]);
                });
            });
        });

        Promise.all(exhibitionPromises)
            .then(exhibitions => {
                res.json(exhibitions);
            })
            .catch(err => {
                console.error('Error resolving promises:', err);
                res.status(500).json({ message: 'Internal server error' });
            });
    })
})

module.exports = app;
