const request = require('supertest');
const app = require('../app');
const { exhibitionDB } = require('../db');

beforeAll(done => {
  exhibitionDB.serialize(() => {
    exhibitionDB.run(`CREATE TABLE Artworks (
        imageID INTEGER PRIMARY KEY AUTOINCREMENT,
        artist VARCHAR(255) NOT NULL,
        description TEXT,
        exhibitionID INT,
        title VARCHAR(255) NOT NULL,
        year INTEGER,
        medium VARCHAR(255),
        imageFilePath VARCHAR(255),
        aspectRatio FLOAT,
        FOREIGN KEY (exhibitionID) REFERENCES Exhibitions(id)
    )`, done);
    exhibitionDB.run(`CREATE TABLE Exhibitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        organizerID INTEGER NOT NULL,
        startTime TIME NOT NULL,
        endTime TIME NOT NULL
    )`, done);
  });
});

afterAll(done => {
  exhibitionDB.close(done);
});

describe('POST /exhibitionCreation', () => {
  it('should create a new exhibition', async () => {
    const response = await request(app)
      .post('/exhibitionCreation')
      .send({
        exhibitionName: 'Impressionist Masters',
        exhibitionLocation: 'Paris',
        exhibitionStartDate: '2025-06-01',
        exhibitionEndDate: '2025-06-30',
        organizerID: 1,
        exhibitionStartTime: '10:00',
        exhibitionEndTime: '18:00'
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
});

const fs = require('fs');
const path = require('path');

describe('POST /artworkFormUpload', () => {
  it('should upload artwork successfully', async () => {
    const response = await request(app)
      .post('/artworkFormUpload')
      .field('title', 'Mona Lisa')
      .field('artist', 'Leonardo da Vinci')
      .field('description', 'A portrait of a woman')
      .field('medium', 'Oil on canvas')
      .field('year', '1503')
      .field('exhibition', 1)
      .field('aspectRatio', '1.5')
      .attach('image', fs.readFileSync(path.join(__dirname, 'test_image.jpg')), 'test_image.jpg');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
});

describe('POST /getExhibitions', () => {
  it('should return exhibitions for the given organizer', async () => {
    const response = await request(app)
      .post('/getExhibitions')
      .field('organizerID', 1);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].id).toBe(1);
    expect(response.body[0].name).toBe('Impressionist Masters');
    expect(response.body[0].location).toBe('Paris');
    expect(response.body[0].startDate).toBe('2025-06-01');
    expect(response.body[0].endDate).toBe('2025-06-30');
    expect(response.body[0].organizerID).toBe(1);
    expect(response.body[0].startTime).toBe('10:00');
    expect(response.body[0].endTime).toBe('18:00');
  });
});

describe('POST /getArtworks', () => {
  it('should return exhibitions for the given organizer', async () => {
    const response = await request(app)
      .post('/getArtworks')
      .field('exhibitID', 1);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toBe('Mona Lisa');
    expect(response.body[0].artist).toBe('Leonardo da Vinci');
    expect(response.body[0].description).toBe('A portrait of a woman');
    expect(response.body[0].medium).toBe('Oil on canvas');
    expect(response.body[0].year).toBe(1503);
    expect(response.body[0].aspectRatio).toBe(1.5);
    expect(response.body[0].imageFilePath).toBe('/art_images/test_image.jpg');
  });
});

describe('POST /editArtwork', () => {
  it('should update artwork details', async () => {
    const response = await request(app)
      .post('/editArtwork')
      .send({
        artworkID: 1,
        title: 'Updated Artwork',
        description: 'Updated description',
        artist: 'Updated artist',
        medium: 'Updated medium',
        year: 2025,
        imageUpdated: 'false',
        aspectRatio: 1.6,
        image: '/art_images/test_image.jpg'
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
});

describe('POST /getArtworks after edit', () => {
  it('should return exhibitions for the given organizer after edit', async () => {
    const response = await request(app)
      .post('/getArtworks')
      .send({ exhibitID: 1});
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toBe('Updated Artwork');
    expect(response.body[0].artist).toBe('Updated artist');
    expect(response.body[0].description).toBe('Updated description');
    expect(response.body[0].medium).toBe('Updated medium');
    expect(response.body[0].year).toBe(2025);
    expect(response.body[0].aspectRatio).toBe(1.6);
    expect(response.body[0].imageFilePath).toBe('/art_images/test_image.jpg');
  });
});
