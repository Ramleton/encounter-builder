import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
	const navigate = useNavigate();

	const handleLoadEncounter = async() => {
		// TODO
	}

	const handleNewEncounter = () => {
		navigate("/editor");
	}

	return (
		<div className="home-container">
			<h1>Encounter Builder</h1>
			<p>Create or load an encounter to begin.</p>


			<div className="home-buttons">
				<button onClick={handleLoadEncounter}>Load Encounter</button>
				<button onClick={handleNewEncounter}>New Encounter</button>
			</div>
		</div>
	)
}

export default Home;