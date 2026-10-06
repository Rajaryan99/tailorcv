import { useState } from 'react'

const initialFormState = {
  jobDescription: '',
  resumeName: '',
  selfDescription: ''
}

export default function useInterviewForm() {
  const [form, setForm] = useState(initialFormState)

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    updateField('resumeName', file ? file.name : '')
  }

  const resetForm = () => setForm(initialFormState)

  return {
    form,
    updateField,
    handleFileChange,
    resetForm
  }
}
