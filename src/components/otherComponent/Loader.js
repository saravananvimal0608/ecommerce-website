
import Gif from '../../emoji/gif.gif'

const loader = () => {
    return (
        <div className="loading d-flex justify-content-center align-items-center" >
            <img src={Gif} alt="loading..." />
        </div>
    )
}

export default loader
