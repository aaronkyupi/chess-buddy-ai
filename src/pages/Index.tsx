import { ChessGame } from '@/components/chess/ChessGame';
import { Helmet } from 'react-helmet';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Chess Master - Play Against AI</title>
        <meta name="description" content="Challenge the AI in chess, learn opening strategies, and improve your game with our beautiful chess application featuring multiple difficulty levels and game timers." />
      </Helmet>
      <ChessGame />
    </>
  );
};

export default Index;
