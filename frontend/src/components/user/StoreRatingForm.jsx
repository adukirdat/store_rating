import { useState } from 'react';
import { rateStore } from '../../api/userApi.js';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { getUserApiMessage } from './userUtils.js';

function StoreRatingForm({ store, onRated }) {
  const [value, setValue] = useState(store.userSubmittedRating ?? ''); const [error, setError] = useState(''); const [pending, setPending] = useState(false);
  const submit = async (event) => { event.preventDefault(); const rating = Number(value); if (!Number.isInteger(rating) || rating < 1 || rating > 5) { setError('Choose a whole-number rating from 1 to 5.'); return; } setError(''); setPending(true); try { await rateStore(store.id, rating); onRated(store.id, store.userSubmittedRating === null ? 'Rating submitted successfully.' : 'Rating updated successfully.'); } catch (requestError) { setError(getUserApiMessage(requestError)); } finally { setPending(false); } };
  const action = store.userSubmittedRating === null ? 'Rate store' : 'Update rating';
  return <form className="rating-form" onSubmit={submit}><fieldset disabled={pending}><legend>{action}</legend><div className="rating-options">{[1, 2, 3, 4, 5].map((rating) => <label key={rating} className={Number(value) === rating ? 'rating-option rating-option--selected' : 'rating-option'}><input type="radio" name={`rating-${store.id}`} value={rating} checked={Number(value) === rating} onChange={(event) => setValue(event.target.value)} /> <span>{rating}</span></label>)}</div></fieldset><ErrorMessage message={error} /><Button type="submit" disabled={pending}>{pending ? 'Saving rating…' : action}</Button></form>;
}

export default StoreRatingForm;
