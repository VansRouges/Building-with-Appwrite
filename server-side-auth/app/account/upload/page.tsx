// pages/index.js
import UploadForm from '@/app/components/UploadForm';
import DisplayData from '@/app/components/DisplayData';

export default function Home() {
    return (
        <div>
            <h1>Upload Image with Appwrite</h1>
            <UploadForm />
            <DisplayData />
        </div>
    );
}
