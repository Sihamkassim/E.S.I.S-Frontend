import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './components/AppRoutes';
import { AppProviders } from './routes/AppProviders';

const App = () => {
  return (
    <Router>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </Router>
  );
};

export default App;


