import { createClient } from '@supabase/supabase-js';
import './App.css'


export const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL
  ,
  import.meta.env.VITE_REACT_APP_ANON_KEY
)