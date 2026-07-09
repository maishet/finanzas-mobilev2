import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  es: {
    translation: {
      auth: { title: 'Fint', subtitle: 'Controla tus cuentas, movimientos y deudas desde un solo lugar.', email: 'Correo', password: 'Contrasena', confirmPassword: 'Confirmar contrasena', signIn: 'Entrar', signUp: 'Crear cuenta', google: 'Continuar con Google', headline: 'Dinero claro, mente tranquila.', intro: 'Registra gastos, ingresos y deudas. Fint te ayuda a ver tu mes sin enredos.', welcome: 'Bienvenido de vuelta', registerTitle: 'Crea tu cuenta', loginHint: 'Entra para revisar tus finanzas.', registerHint: 'Empieza a ordenar tu dinero desde Fint.', noAccount: 'No tienes cuenta?', hasAccount: 'Ya tienes cuenta?', registerLink: 'Registrate', loginLink: 'Inicia sesion', continueWith: 'O continua con', processing: 'Procesando...', invalidCredentials: 'Correo o contrasena incorrectos.', emailNotConfirmed: 'Confirma tu correo antes de iniciar sesion.', alreadyRegistered: 'Este correo ya tiene una cuenta.', invalidForm: 'Ingresa un correo valido y una contrasena de al menos 6 caracteres.', passwordMismatch: 'Las contrasenas no coinciden.' },
      header: { menuTitle: 'Preferencias', darkMode: 'Modo oscuro', lightMode: 'Modo claro', openMenu: 'Abrir menú' },
      tabs: { dashboard: 'Inicio', accounts: 'Cuentas', movements: 'Movimientos', debts: 'Deudas' },
      actions: { newAccount: 'Nueva cuenta', newMovement: 'Nuevo movimiento', newIncome: 'Ingreso', newExpense: 'Gasto', viewAll: 'Ver todos', signOut: 'Cerrar sesion', save: 'Guardar' },
      empty: { accounts: 'Aun no tienes cuentas.', movements: 'Aun no tienes movimientos.', debts: 'Aun no tienes deudas.' },
      dashboard: {
        title: 'Tu resumen financiero',
        subtitle: 'Una mirada rapida a tu mes',
        totalBalance: 'Balance total',
        monthFlow: 'Flujo del mes',
        quickActions: 'Registrar rapido',
        income: 'Ingresos',
        expenses: 'Gastos',
        savings: 'Ahorro',
        spendingByCategory: 'Gastos por categoria',
        recommendations: 'Ideas para tu dinero',
        recentActivity: 'Actividad reciente',
        loading: 'Cargando tu panorama financiero...',
        errorTitle: 'No pudimos cargar el dashboard',
        emptyMovements: 'Aun no tienes movimientos. Registra tu primer ingreso o gasto.',
        emptyCategories: 'Registra gastos con categoria para ver tu distribucion.',
        savingStatus: 'Vas con saldo positivo este mes.',
        deficitStatus: 'Tus gastos superan tus ingresos este mes.',
        noIncomeTip: 'Agrega tus ingresos para comparar mejor tu mes.',
        highExpenseTip: 'Revisa tus categorias con mas gasto y define un limite simple.',
        firstMoveTip: 'Empieza registrando un ingreso o gasto para activar tu dashboard.',
      },
      forms: { newAccount: 'Nueva cuenta', newMovement: 'Nuevo movimiento', amount: 'Monto', currency: 'Moneda', category: 'Categoria', account: 'Cuenta', note: 'Nota', expense: 'Gasto', income: 'Ingreso', name: 'Nombre', accountType: 'Tipo', cash: 'Efectivo', openingBalance: 'Saldo inicial' },
    },
  },
  en: {
    translation: {
      auth: { title: 'Fint', subtitle: 'Track accounts, transactions, and debts in one place.', email: 'Email', password: 'Password', confirmPassword: 'Confirm password', signIn: 'Sign in', signUp: 'Create account', google: 'Continue with Google', headline: 'Clear money, calm mind.', intro: 'Track expenses, income, and debts. Fint helps you understand your month without friction.', welcome: 'Welcome back', registerTitle: 'Create your account', loginHint: 'Sign in to review your finances.', registerHint: 'Start organizing your money with Fint.', noAccount: 'No account?', hasAccount: 'Already have an account?', registerLink: 'Register', loginLink: 'Sign in', continueWith: 'Or continue with', processing: 'Processing...', invalidCredentials: 'Email or password is incorrect.', emailNotConfirmed: 'Confirm your email before signing in.', alreadyRegistered: 'This email already has an account.', invalidForm: 'Enter a valid email and a password with at least 6 characters.', passwordMismatch: 'Passwords do not match.' },
      header: { menuTitle: 'Preferences', darkMode: 'Dark mode', lightMode: 'Light mode', openMenu: 'Open menu' },
      tabs: { dashboard: 'Home', accounts: 'Accounts', movements: 'Movements', debts: 'Debts' },
      actions: { newAccount: 'New account', newMovement: 'New movement', newIncome: 'Income', newExpense: 'Expense', viewAll: 'View all', signOut: 'Sign out', save: 'Save' },
      empty: { accounts: 'You do not have accounts yet.', movements: 'You do not have movements yet.', debts: 'You do not have debts yet.' },
      dashboard: {
        title: 'Your financial snapshot',
        subtitle: 'A quick look at your month',
        totalBalance: 'Total balance',
        monthFlow: 'Monthly flow',
        quickActions: 'Quick entry',
        income: 'Income',
        expenses: 'Expenses',
        savings: 'Savings',
        spendingByCategory: 'Spending by category',
        recommendations: 'Money ideas',
        recentActivity: 'Recent activity',
        loading: 'Loading your financial overview...',
        errorTitle: 'Could not load dashboard',
        emptyMovements: 'No movements yet. Add your first income or expense.',
        emptyCategories: 'Add expenses with categories to see your distribution.',
        savingStatus: 'You have a positive flow this month.',
        deficitStatus: 'Your expenses are above your income this month.',
        noIncomeTip: 'Add your income to compare your month better.',
        highExpenseTip: 'Review your top spending categories and set a simple limit.',
        firstMoveTip: 'Start by adding an income or expense to activate your dashboard.',
      },
      forms: { newAccount: 'New account', newMovement: 'New movement', amount: 'Amount', currency: 'Currency', category: 'Category', account: 'Account', note: 'Note', expense: 'Expense', income: 'Income', name: 'Name', accountType: 'Type', cash: 'Cash', openingBalance: 'Opening balance' },
    },
  },
}

const deviceLanguage = Localization.getLocales()[0]?.languageCode === 'en' ? 'en' : 'es'

i18n.use(initReactI18next).init({ resources, lng: deviceLanguage, fallbackLng: 'es', interpolation: { escapeValue: false } })

export default i18n
