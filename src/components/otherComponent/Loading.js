import Gif from '../../emoji/gif.gif'

const Loader = () => {
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.2)", zIndex: 9999,
            display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div className=" text-primary" >
                <img src={Gif} alt="loading..."></img> <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};
export default Loader;