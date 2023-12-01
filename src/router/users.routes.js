import { Layout, List } from '../views/user'

export default {
  path: '/users',
  component: Layout,
  children: [{ path: '', component: List }]
}
