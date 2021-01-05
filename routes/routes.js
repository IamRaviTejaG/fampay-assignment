import baseController from '../controllers/baseController'
import getController from '../controllers/getController'
import searchController from '../controllers/searchController'

const routes = (router) => {
  router.route('/')
    .get(baseController.basePage)

  router.route('/get/:page?')
    .get(getController.getPage)

  router.route('/search/:searchString')
    .get(searchController.search)
}

export default routes
