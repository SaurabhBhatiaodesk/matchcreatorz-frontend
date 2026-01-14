import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import ReactSelect from 'react-select';
import { useCountryListQuery, useUpdateEmailPhoneMutation } from 'services';
import useAuthStore from 'store/auth';
import useCommonStore, { setModalConfig } from 'store/common';
import './styles.scss';

const UpdatePhoneEmail: React.FC<any> = () => {
	const { user }: Record<string, any> = useAuthStore((state) => state.userInfo ?? {});
	const { modalConfig = {}, hideCommonModal }: any = useCommonStore((state) => state);
	const { mutateAsync: updateEmailPhoneMutation } = useUpdateEmailPhoneMutation();
	const { data: countryList = [] } = useCountryListQuery();
	const payload = {
		email: user?.email,
		countryCode: user?.countryCode,
		phone: user?.phone,
	};
	const [email, setEmail] = useState(payload.email || '');
	const [countryCode, setCountryCode] = useState(payload?.countryCode || '+91');
	const [phone, setPhone] = useState(payload.phone || '');
	const [countrySlug, setCountrySlug] = useState(
		countryList?.country?.find((item: any) => item.code === (payload?.countryCode || '+91'))
			?.slug || 'in', // Default to 'in'
	);
	const [errors, setErrors] = useState({ email: '', phone: '', countryCode: '' });

	const validateForm = () => {
		let formValid = true;
		const newErrors = { email: '', phone: '', countryCode: '' };

		if (modalConfig?.data?.verificationType === 'EMAIL') {
			if (!email) {
				newErrors.email = 'Please enter your email address.'; // More engaging tone
				formValid = false;
			} else {
				const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

				if (!emailPattern.test(email)) {
					newErrors.email = 'Please provide a valid email address.'; // Clearer guidance
					formValid = false;
				}
			}
		} else {
			if (!countryCode) {
				newErrors.countryCode = 'Please enter your country code.'; // More engaging tone
				formValid = false;
			}
			if (!phone) {
				newErrors.phone = 'Please enter your mobile number.'; // More engaging tone
				formValid = false;
			}
		}

		setErrors(newErrors);
		return formValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		let payload: any;
		if (modalConfig?.data?.verificationType === 'EMAIL') {
			payload = { email };
		} else if (modalConfig?.data?.verificationType === 'PHONE') {
			payload = { countryCode, phone };
		}

		const res = await updateEmailPhoneMutation(payload);

		if (res?.success) {
			toast.success(res?.message);
			handleClick();
		}
	};

	const handleClick = () => {
		setModalConfig({
			visible: true,
			id: null,
			data: {
				verificationType: modalConfig?.data?.verificationType,
				type: modalConfig?.data?.type,
				phone: countryCode + phone,
				email: email,
			},
			type: 'verifyOTP',
		});
	};

	const formatOptionLabel = ({
		slug,
		code,
		countryName,
	}: {
		slug: string;
		code: string;
		countryName: string;
	}) => (
		<div className="d-flex align-items-center">
			{slug ? (
				<img
					src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${slug.toLowerCase()}.svg`}
					alt={countryName}
					style={{ width: '20px', height: '15px', marginRight: '10px' }}
				/>
			) : null}
			<span>{code}</span>
		</div>
	);

	return (
		<>
			<button onClick={() => hideCommonModal()} className="modal-close-btn border-0 p-0">
				<i className="ri-close-line"></i>
			</button>
			<Modal.Body>
				<h2 className="modal-title mb-4">
					Update {modalConfig?.data?.verificationType === 'EMAIL' ? 'Email' : 'Phone'}
				</h2>
				<Form className="modal-form auth-form" onSubmit={handleSubmit}>
					{modalConfig?.data?.verificationType === 'EMAIL' ? (
						<Form.Group className="mb-4">
							<Form.Control
								type="email"
								name="email"
								placeholder="Email"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								className={errors.email ? 'border-red' : ''}
							/>
							{errors.email && <span className="text-danger f-error">{errors.email}</span>}
						</Form.Group>
					) : (
						<Form.Group className="mb-4">
							<div className="d-flex position-relative">
								<ReactSelect
									isSearchable
									className="form-react-select phone"
									classNamePrefix="form-react-select"
									placeholder="+91"
									name="countryCode"
									autoFocus={false}
									options={countryList?.country || []}
									getOptionLabel={(option: any) => `${option?.code}`}
									getOptionValue={(option: any) => option?.slug}
									formatOptionLabel={formatOptionLabel}
									onChange={(value: any) => {
										setCountryCode(value?.code || '+91');
										setCountrySlug(value?.slug || 'in');
									}}
									value={
										countryList?.country?.find((item: any) => item.slug === countrySlug) || null
									}
								/>
								<Form.Control
									type="text"
									placeholder="Phone Number"
									name="phone"
									autoComplete="off"
									maxLength={12}
									onChange={(e) => setPhone(e.target.value)}
									value={phone}
									className={`phone-padding ${errors.phone ? 'border-red' : ''}`}
								/>
							</div>
							{errors.phone && <span className="text-danger f-error">{errors.phone}</span>}
						</Form.Group>
					)}
					<div className="d-flex gap-3 justify-content-center mt-4">
						<button className="primary-btn" onClick={() => hideCommonModal()}>
							Cancel
						</button>
						<button
							className={`secondary-btn ${
								modalConfig?.data?.verificationType === 'EMAIL'
									? user?.isEmailVerified && email === user?.email
										? 'disabled'
										: ''
									: user?.isPhoneVerified &&
										  phone === user?.phone &&
										  countryCode === user?.countryCode
										? 'disabled'
										: ''
							}`}
							type="submit"
							disabled={
								modalConfig?.data?.verificationType === 'EMAIL'
									? user?.isEmailVerified && email === user?.email
									: user?.isPhoneVerified &&
										phone === user?.phone &&
										countryCode === user?.countryCode
							}
						>
							Update
						</button>
					</div>
				</Form>
			</Modal.Body>
		</>
	);
};

export default UpdatePhoneEmail;
