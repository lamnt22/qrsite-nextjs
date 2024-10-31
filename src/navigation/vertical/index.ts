// ** Icon imports
import Account from 'mdi-material-ui/Account'
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { Payment } from '@mui/icons-material';
import { translation } from 'src/utils/i18n.util';
import RamenDiningIcon from '@mui/icons-material/RamenDining';


const navigation = (): VerticalNavItemsType => {
    return [
      // {
      //   title: translation("dashboard"),
      //   icon: HomeOutline,
      //   path: '/',
      // },
      {
        sectionTitle: 'Pages'
      },
      {
        title: translation("order.order"),
        icon: ReceiptLongIcon,
        path: '/order',
      },
      {
        title: 'Dishes',
        icon: RamenDiningIcon,
        path: '/dishes',
      },
      {
        title: 'Table',
        icon: TableRestaurantIcon,
        path: '/dinner-table',
      },
      {
        title: 'Payment',
        icon: Payment,
        path: '/payment',
      },
      {
        title: 'Staff',
        icon: Account,
        path: '/staff',
      },
      {
        title: 'Category',
        icon: CategoryIcon,
        path: '/category',
      },
      {
        title: 'Logout',
        icon: LogoutIcon,
        path: '/login',
      },

    ]

}

export default navigation
