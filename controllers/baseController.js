import path from 'path'

export default {
  /**
   * Returns the base HTML page when the base route is hit.
   * @param  req
   * @param  res
   */
  basePage: (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, '../static/base.html'))
  }
}
