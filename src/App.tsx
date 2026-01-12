import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import "./App.css";

type Option = {
  id: string;
  text: string;
};

type Poll = {
  id: string;
  title: string;
  options: Option[];
};

type PollsData = {
  polls: Poll[];
};

const GET_POLLS = gql`
  query {
    polls {
      id
      title
      options {
        id
        text
      }
    }
  }
`;

const VOTE_MUTATION = gql`
  mutation Vote($pollId: ID!, $optionId: ID!, $isAnonymous: Boolean!) {
    vote(
      pollId: $pollId
      optionId: $optionId
      isAnonymous: $isAnonymous
    )
  }
`;

function App() {
  const { loading, error, data } = useQuery<PollsData>(GET_POLLS);
  const [vote] = useMutation(VOTE_MUTATION);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [voteMessage, setVoteMessage] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  if (loading) return (
    <div className="app-wrapper">
      <div className="container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="app-wrapper">
      <div className="container">
        <div className="error-container">
          <p>Erreur de chargement</p>
        </div>
      </div>
    </div>
  );

  const poll = data!.polls[0];

  const handleVote = async () => {
    if (!selectedOption) {
      setVoteMessage("Veuillez sélectionner une option");
      return;
    }

    setIsVoting(true);

    try {
      await vote({
        variables: {
          pollId: poll.id,
          optionId: selectedOption,
          isAnonymous,
        },
      });

      setHasVoted(true);
      setVoteMessage("Vote enregistré");
      
      setTimeout(() => setIsVoting(false), 500);
    } catch {
      setVoteMessage("Erreur lors du vote");
      setIsVoting(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>QuickPoll</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link active">Accueil</a>
            <a href="#" className="nav-link">Sondages</a>
            <a href="#" className="nav-link">À propos</a>
          </nav>
        </div>
      </header>

      <div className="container">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        {/* Main Content */}
        <div className="content-wrapper">
          {/* Side Info */}
          <div className="side-info">
            <div className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Comment voter ?</h3>
              <p>Sélectionnez votre option préférée et cliquez sur "Voter" pour soumettre votre choix.</p>
            </div>

            <div className="info-card">
              <div className="info-icon security">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3>Vote sécurisé</h3>
              <p>Vos données sont protégées et vous pouvez voter de manière anonyme.</p>
            </div>
          </div>

          {/* Poll Card */}
          <div className={`card ${hasVoted ? 'voted' : ''}`}>
            <div className="card-header">
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="title">{poll.title}</h1>
              <div className="title-underline"></div>
            </div>

            <div className="options">
              {poll.options.map((opt, index) => (
                <label
                  key={opt.id}
                  className={`option ${selectedOption === opt.id ? "selected" : ""} ${hasVoted ? "disabled" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <input
                    type="radio"
                    name="option"
                    disabled={hasVoted}
                    onChange={() => setSelectedOption(opt.id)}
                  />
                  <span className="option-text">{opt.text}</span>
                  {selectedOption === opt.id && (
                    <span className="checkmark">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                </label>
              ))}
            </div>

            <label className="anonymous">
              <input
                type="checkbox"
                checked={isAnonymous}
                disabled={hasVoted}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span className="anonymous-text">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
                Voter anonymement
              </span>
            </label>

            <button
              className={`vote-btn ${isVoting ? 'voting' : ''}`}
              onClick={handleVote}
              disabled={hasVoted || isVoting}
            >
              {isVoting ? (
                <>
                  <span className="btn-spinner"></span>
                  Envoi...
                </>
              ) : hasVoted ? (
                "Vote enregistré"
              ) : (
                "Voter"
              )}
            </button>

            {voteMessage && (
              <div className={`message ${hasVoted && !voteMessage.includes("Erreur") ? "success" : "error"}`}>
                {voteMessage}
              </div>
            )}

            {hasVoted && (
              <div className="locked">
                <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
                Vous ne pouvez plus voter
              </div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="stats-panel">
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">1,247</span>
                <span className="stat-label">Participants</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon votes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">3,842</span>
                <span className="stat-label">Votes totaux</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">2j 14h</span>
                <span className="stat-label">Temps restant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>QuickPoll</h4>
            <p>Plateforme de sondage en ligne simple et sécurisée</p>
          </div>
          <div className="footer-section">
            <h4>Liens rapides</h4>
            <a href="#">Documentation</a>
            <a href="#">Support</a>
            <a href="#">Confidentialité</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <a href="mailto:contact@quickpoll.com">contact@quickpoll.com</a>
            <div className="social-links">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="GitHub">GitHub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 QuickPoll. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
