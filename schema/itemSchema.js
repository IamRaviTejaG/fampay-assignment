import mongoose from 'mongoose'
const Schema = mongoose.Schema

/**
 * Item Schema
 * @constant {Schema}
 */
const itemSchema = {
  video_id: {
    type: String,
    unique: true,
    select: true,
    trim: true
  },
  title: {
    type: String,
    unique: false,
    select: true,
    trim: true
  },
  description: {
    type: String,
    unique: false,
    select: true,
    trim: true
  },
  thumbnail: {
    type: String,
    unique: true,
    select: true,
    trim: true
  },
  channel_id: {
    type: String,
    unique: false,
    select: true,
    trim: true
  },
  channel_title: {
    type: String,
    unique: false,
    select: true,
    trim: true
  },
  publish_time: {
    type: Date,
    unique: false,
    select: true,
    trim: true
  },
  __v: {
    type: Number,
    select: false
  }
}

module.exports = new Schema(itemSchema)
