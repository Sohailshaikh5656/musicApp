import { LineWave } from "react-loader-spinner";
const Loader = () => {
    return (
        <div className="d-flex justify-content-center align-item-center" style={{minHeight:"100vh"}}>
            <div className="loader">
                <LineWave
                    visible={true}
                    height="200"
                    width="200"
                    color="#4fa94d"
                    ariaLabel="line-wave-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    firstLineColor=""
                    middleLineColor=""
                    lastLineColor=""
                    />
            </div>
        </div>
            )

}

export default Loader