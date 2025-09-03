import { supabase } from '@/supabaseClient'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

let AI_API_LINK = import.meta.env.VITE_APP_AI_API_LINK
let AI_API_KEY = import.meta.env.VITE_APP_AI_API_KEY

const handleGetPrompt = async (body) => {
    try {
        let response = await axios.post(AI_API_LINK, body, {
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': AI_API_KEY
            }
        })
        return response.data;
    }
    catch (err) {
        return err
    }
}

export const handleGetQuestion = createAsyncThunk('interview/get-question',
    async ({ existingIAs, role, category, difficulty }, { rejectWithValue }) => {
        let body = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": `You are an interviewer. Ask me one question based on Role: ${role}, Difficulty: ${difficulty}, Category: ${category}. Question inside {$$question$$}{$$question$$} tag
                            ${existingIAs?.length > 0 ? `and make sure you dont similiar to these questions ${existingIAs.map(existingIA=> `${existingIA.question}`).join(' ')}` : ''}`
                        }
                    ]
                }
            ]

        }

        try {
            let response = await handleGetPrompt(body)
            let text = response?.candidates[0].content.parts[0].text
            const regex = /\{\$\$question\$\$\}([\s\S]*?)\{\$\$question\$\$\}/
            const match = text.match(regex)
            return { question: match ? match[1].trim() : null, setup: { role, category, difficulty } }
        }
        catch (err) {
            return rejectWithValue({message: err.response?.data.error || err.message || 'Uncaught error'})
        }

    })

export const handleSubmitAnswer = createAsyncThunk('interview/get-answer', async ({ question, answer, setup }, { rejectWithValue }) => {

    let requiredFeedBacks = ['score', 'strengths', 'weaknesses', 'suggestions']

    let body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": `You are an interview evaluator. Give structured feedback with score, strengths, and improvements with explaination in some words. Response has to be inside this tag ${requiredFeedBacks.map(feedBack => `{$$${feedBack}$$} ... {$$${feedBack}$$}`).join(' ')} Question: ${question} ${answer}`
                    }
                ]
            }
        ]
    }

    try {
        let response = await handleGetPrompt(body)
        let text = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

        let feedback = requiredFeedBacks.reduce((acc, key) => {
            const regex = new RegExp(
                `\\{\\$\\$\\s*${key}\\s*\\$\\$\\}[:]?\s*([\\s\\S]*?)\\{\\$\\$\\s*${key}\\s*\\$\\$\\}`
            )

            const match = text.match(regex)
            acc[key] = match?.[1]?.trim() || null

            return acc
        }, {})

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw new Error("User not authenticated")

        let interviewData = await supabase.from('interview_attempts').insert({
            user_id: user.id,
            question, answer,
            feedback: JSON.stringify({
                strengths: feedback.strengths,
                weaknesses: feedback.weaknesses,
                suggestions: feedback.suggestions
            }),
            score: feedback.score || null,
            setup: JSON.stringify({
                role: setup.role,
                category: setup.category,
                difficulty: setup.difficulty
            })
        })

        if (interviewData) {
            return { answer, feedback }
        }
    }
    catch (err) {
        console.log(err)
        return rejectWithValue({message: err.response?.data.error || err.message || 'Uncaught error'})
    }

})

export const getInterviewAttempts = createAsyncThunk('interview/get-interview-attempts', async (id, { rejectWithValue }) => {
    try {
        let { data } = await supabase.from('interview_attempts').select(`*`).eq('user_id', id)
        return {interviewAttempts: data}
    }
    catch (err) {
        console.log(err)
        return rejectWithValue({message: err.response?.data.error || err.message || 'Uncaught error'})
    }
})

let initialState = {
    loading: false,
    error: null,
    success: null,
    question: null,
    answer: null,
    setup: null,
    feedback: null,
    currentIA: null,
    interviewAttempts: []
}

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        resetAlert: (state) =>{
            state.success = null;
            state.error = null
        },
        resetFeedback: (state) => {
            state.feedback = null
            state.question = null
            state.answer = null
        },
        setCurrentIA: (state, action) =>{
            state.currentIA = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleGetQuestion.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleGetQuestion.fulfilled, (state, action) => {
                state.question = action.payload.question || null
                state.setup = action.payload.setup
                state.success = {message: 'Question generated', type: 'interview/get-question'}
                state.loading = false
            })
            .addCase(handleGetQuestion.rejected, (state, action) => {
                state.error = {message: action.payload.message, type: 'interview/get-question'}
                state.loading = false
            })
            .addCase(handleSubmitAnswer.pending, (state, action) => {
                state.loading = true
            })
            .addCase(handleSubmitAnswer.fulfilled, (state, action) => {
                state.answer = action.payload.answer
                state.feedback = action.payload.feedback
                state.success = {message: 'Answer submitted', type: 'interview/get-answer'}
                state.loading = false
            })
            .addCase(handleSubmitAnswer.rejected, (state, action) => {
                state.error = {message: action.payload.message, type: 'interview/get-answer'}
                state.loading = false
            })
            .addCase(getInterviewAttempts.pending, (state) => {
                state.loading = true
            })
            .addCase(getInterviewAttempts.fulfilled, (state, action) => {
                state.interviewAttempts = action.payload.interviewAttempts
                state.success = {message: action.payload.interviewAttempts?.length > 0 ? 'Interview attempts fetched' : 'No interview attempts found', type: 'get-interview-attempts'}
                state.loading = false
            })
            .addCase(getInterviewAttempts.rejected, (state, action) => {
                state.error = {message: action.payload.message, type: 'get-interview-attempts'}
                state.loading = false
            })
    }
})

export const { resetFeedback, setCurrentIA, resetAlert } = interviewSlice.actions

export default interviewSlice.reducer