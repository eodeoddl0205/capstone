import Camera from "../components/camera/cameraupload"
import Header from "../components/header/header"

export default function home() {
    return (
        <div>
            <Header></Header>
            <section className="vpack mt(100) gap(70)">
                <h1 className="font-size(48) bold c(#2464E0) dark:c(#fff) @w(~769):font-size(36)">학교 로고 감지 AI</h1>
                <div>
                    <Camera></Camera>
                </div>
            </section>
        </div>
    )
}