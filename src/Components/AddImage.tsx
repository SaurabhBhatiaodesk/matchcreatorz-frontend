import 'bootstrap/dist/css/bootstrap.min.css';
import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useBucketUrlMutation } from 'services';
import { compressFileSize, useUploadFileMutation } from 'services/util.service';
import 'styles/auth.scss';
import { imageBucketUrl } from 'utils';

interface AddImageProps {
	updateImageData: (imageData: string | string[]) => void;
	setIsUploading: (isUploading: boolean) => void;
	isMultiple: boolean;
}
const AddImage: React.FC<AddImageProps> = ({ updateImageData, setIsUploading, isMultiple }) => {
	const { mutateAsync: bucketUrlMutation } = useBucketUrlMutation();
	const { mutateAsync: uploadFileMutation } = useUploadFileMutation();

	const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [fileData, setFileData] = useState<any>([]);

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const imageDataUrl = await readFile(file);
			setIsUploading(true);
			try {
				const response = await fetch(imageDataUrl);
				const blobData: any = await response.blob();
				const newFile: any = await compressFileSize(blobData);
				const imgPath = await imageBucketUrl(
					newFile,
					'image/png',
					newFile.size,
					bucketUrlMutation,
					uploadFileMutation,
				);

				if (imgPath) {
					updateImageData(imgPath);
					setIsUploading(false);
				} else {
					toast.error('Please try again');
				}
				setIsUploading(false);
			} catch (e) {
				console.error(e);
			}
		}
	};

	function readFile(file: File): Promise<string> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.addEventListener('load', () => resolve(reader.result as string), false);
			reader.readAsDataURL(file);
		});
	}

	const processFiles = async (files: File[]) => {
		return await Promise.all(
			files.map(async (file) => {
				const isImage = file.type.startsWith('image/') ? true : false;
				const fileData: any = isImage ? await compressFileSize(file) : file;
				return {
					file: URL.createObjectURL(fileData),
					mediaType: file.type || '',
				};
			}),
		);
	};

	const handleMediaChange = async (event: ChangeEvent<HTMLInputElement>) => {
		setError(null);
		setIsUploading(true);
		if (!event.target.files) return;

		const newFiles = Array.from(event.target.files);

		const validFiles = newFiles.filter((file) => file && file.type.startsWith('image/'));
		const invalidFiles = newFiles.filter((file) => file && !file.type.startsWith('image/'));

		if (invalidFiles.length > 0) {
			setError('Please upload only image files.'); // More engaging and clear
			setIsUploading(false);
			return;
		}

		const totalFiles = uploadedMedia.length + validFiles.length;
		const allowedFiles =
			totalFiles > 10 ? validFiles.slice(0, 10 - uploadedMedia.length) : validFiles;

		const newMedia = await processFiles(allowedFiles);
		const updatedMedia = [...uploadedMedia, ...newMedia];
		const response = await bucketUrlMutation(
			`?location=users&type=png&count=${updatedMedia?.length}`,
		);
		if (response?.success) {
			const mergedMedia = updatedMedia.map((mediaItem, index) => ({
				...mediaItem,
				...(response.data[index] || {}),
			}));

			const temp = response?.data?.map((item: any) => {
				return item?.filename;
			});

			setFileData([...fileData, ...allowedFiles]);
			setUploadedMedia(mergedMedia);
			updateImageData(temp);
		} else {
			setError('There was an error uploading your files. Please try again.'); // More specific error message
		}

		if (totalFiles > 10) {
			setError('You can upload a maximum of 10 media files only.'); // Slightly clearer message
		}

		setIsUploading(false);
	};

	return (
		<input
			accept=".png, .jpg"
			type="file"
			onChange={(e) => (isMultiple ? handleMediaChange(e) : onFileChange(e))}
			multiple={false}
		/>
	);
};

export default AddImage;
