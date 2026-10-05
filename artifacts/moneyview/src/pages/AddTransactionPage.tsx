import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { EmptyState, ErrorState, LoadingState } from '@/components/RemoteState';
import { PageHeading } from '@/components/moneyview/PageHeading';
import { useFetch } from '@/hooks/useFetch.js';
import {
  createTransaction,
  getAccounts,
  getCategories,
} from '@/services/api.js';
import type { Account, NewTransaction } from '@/types/moneyview';
import { formatMoney } from '@/utils/format.js';

function getLocalToday() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 10);
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

const transactionSchema = z.object({
  accountId: z.string().min(1, 'Choose a sample account.'),
  date: z
    .string()
    .min(1, 'Choose a date.')
    .refine(isCalendarDate, 'Enter a valid date.')
    .refine((value) => value <= getLocalToday(), 'Date cannot be in the future.'),
  description: z
    .string()
    .trim()
    .min(1, 'Add a description.')
    .max(80, 'Keep the description under 80 characters.'),
  category: z.string().min(1, 'Choose a category.'),
  amount: z
    .string()
    .trim()
    .min(1, 'Enter an amount.')
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      'Amount must be greater than zero.',
    )
    .transform(Number),
  type: z.enum(['in', 'out']),
});

type FormInput = z.input<typeof transactionSchema>;
type FormOutput = z.output<typeof transactionSchema>;

export default function AddTransactionPage() {
  const categoriesQuery = useFetch<string[]>(getCategories);
  const accountsQuery = useFetch<Account[]>(getAccounts);
  const [saveError, setSaveError] = useState<string>();
  const navigate = useNavigate();
  const categories = categoriesQuery.data ?? [];
  const accounts = accountsQuery.data ?? [];
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      accountId: '',
      date: getLocalToday(),
      description: '',
      category: '',
      amount: '',
      type: 'out',
    },
  });

  useEffect(() => {
    if (accounts.length > 0 && !form.getValues('accountId')) {
      form.setValue('accountId', accounts[0].id, { shouldValidate: false });
    }
  }, [accounts, form]);

  async function handleSave(values: FormOutput) {
    setSaveError(undefined);
    const data: NewTransaction = {
      ...values,
      description: values.description.trim(),
      amount: values.amount,
    };

    try {
      await createTransaction(data);
      navigate('/transactions', {
        state: {
          description: data.description,
          amount: data.amount,
          type: data.type,
        },
      });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'We could not save this transaction. Your entries are still here; try again.',
      );
    }
  }

  const loading = categoriesQuery.isLoading || accountsQuery.isLoading;
  const error = categoriesQuery.error || accountsQuery.error;

  return (
    <div className="mv-content mv-form-content" data-testid="add-transaction-page">
      <PageHeading
        eyebrow="SAMPLE ACTIVITY"
        title="Add a transaction"
        description="Create a fictional entry. It will appear in your sample history."
      />

      {loading ? (
        <LoadingState label="Loading sample accounts and categories…" />
      ) : categoriesQuery.error ? (
        <ErrorState
          message="We could not load transaction categories right now."
          onRetry={categoriesQuery.refetch}
        />
      ) : accountsQuery.error ? (
        <ErrorState
          message="We could not load your sample accounts right now."
          onRetry={accountsQuery.refetch}
        />
      ) : categories.length === 0 || accounts.length === 0 ? (
        <EmptyState
          title="The sample form is not ready"
          description="This demo needs at least one sample account and category before you can add a transaction."
          action={<Link className="button button-secondary" to="/">Return to overview</Link>}
        />
      ) : (
        <section className="mv-form-card" aria-labelledby="transaction-form-title">
          <div className="mv-form-card-header">
            <div>
              <p className="card-kicker">NEW SAMPLE ENTRY</p>
              <h2 id="transaction-form-title">Transaction details</h2>
            </div>
            <span className="mv-form-sample-label">Fictional data only</span>
          </div>

          {error ? (
            <p className="mv-inline-note" role="status">
              {error}
            </p>
          ) : null}
          {saveError ? (
            <div className="mv-save-error" role="alert">
              <strong>We could not save this transaction.</strong>
              <p>{saveError}</p>
              <p>Your entries are still here. You can try again without retyping them.</p>
            </div>
          ) : null}

          <form
            className="mv-transaction-form"
            noValidate
            onSubmit={form.handleSubmit(handleSave)}
          >
            <div className="mv-form-grid">
              <div className="mv-field">
                <label htmlFor="transaction-account">Sample account</label>
                <select
                  id="transaction-account"
                  aria-invalid={Boolean(form.formState.errors.accountId)}
                  aria-describedby={
                    form.formState.errors.accountId
                      ? 'transaction-account-error'
                      : undefined
                  }
                  {...form.register('accountId')}
                >
                  <option value="">Choose an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} · {account.maskedNumber}
                    </option>
                  ))}
                </select>
                {form.formState.errors.accountId ? (
                  <span className="mv-field-error" id="transaction-account-error">
                    {form.formState.errors.accountId.message}
                  </span>
                ) : null}
              </div>

              <div className="mv-field">
                <label htmlFor="transaction-date">Date</label>
                <input
                  id="transaction-date"
                  type="date"
                  max={getLocalToday()}
                  aria-invalid={Boolean(form.formState.errors.date)}
                  aria-describedby={
                    form.formState.errors.date ? 'transaction-date-error' : undefined
                  }
                  {...form.register('date')}
                />
                {form.formState.errors.date ? (
                  <span className="mv-field-error" id="transaction-date-error">
                    {form.formState.errors.date.message}
                  </span>
                ) : null}
              </div>

              <div className="mv-field mv-field-full">
                <label htmlFor="transaction-description">Description</label>
                <input
                  id="transaction-description"
                  type="text"
                  autoComplete="off"
                  maxLength={80}
                  placeholder="For example, Northstar Foods"
                  aria-invalid={Boolean(form.formState.errors.description)}
                  aria-describedby={
                    form.formState.errors.description
                      ? 'transaction-description-error'
                      : undefined
                  }
                  {...form.register('description')}
                />
                {form.formState.errors.description ? (
                  <span className="mv-field-error" id="transaction-description-error">
                    {form.formState.errors.description.message}
                  </span>
                ) : null}
              </div>

              <div className="mv-field">
                <label htmlFor="transaction-category">Category</label>
                <select
                  id="transaction-category"
                  aria-invalid={Boolean(form.formState.errors.category)}
                  aria-describedby={
                    form.formState.errors.category
                      ? 'transaction-category-error'
                      : undefined
                  }
                  {...form.register('category')}
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category ? (
                  <span className="mv-field-error" id="transaction-category-error">
                    {form.formState.errors.category.message}
                  </span>
                ) : null}
              </div>

              <div className="mv-field">
                <label htmlFor="transaction-amount">Amount (NGN)</label>
                <div className="mv-amount-input">
                  <span aria-hidden="true">₦</span>
                  <input
                    id="transaction-amount"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    aria-invalid={Boolean(form.formState.errors.amount)}
                    aria-describedby={
                      form.formState.errors.amount
                        ? 'transaction-amount-error'
                        : 'transaction-amount-help'
                    }
                    {...form.register('amount')}
                  />
                </div>
                {form.formState.errors.amount ? (
                  <span className="mv-field-error" id="transaction-amount-error">
                    {form.formState.errors.amount.message}
                  </span>
                ) : (
                  <span className="mv-field-help" id="transaction-amount-help">
                    Enter an amount greater than zero.
                  </span>
                )}
              </div>

              <fieldset className="mv-field mv-type-field">
                <legend>Type</legend>
                <div className="mv-type-options">
                  <label className="mv-type-option">
                    <input type="radio" value="out" {...form.register('type')} />
                    <span>
                      <strong>Money out</strong>
                      <small>Sample spending</small>
                    </span>
                  </label>
                  <label className="mv-type-option">
                    <input type="radio" value="in" {...form.register('type')} />
                    <span>
                      <strong>Money in</strong>
                      <small>Sample income</small>
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="mv-form-footer">
              <p>
                This entry stays in the local demo database. It does not move
                real money.
              </p>
              <button
                className="button button-primary"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save transaction'}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
