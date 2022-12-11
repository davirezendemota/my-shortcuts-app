import Head from 'next/head'
import { getShortcuts } from '../scripts/shortcuts'
import { useState, useEffect } from 'react'

export default function Home({ data }) {

  const [form, setForm] = useState([])

  const [shortcuts, updateShortcuts] = useState(data)


  function handleForm(e) {

    setForm((fields) => ({
      ...fields,
      [e.target.name]: e.target.value
    }))

  }

  async function handleSubmit(e) {
    e.preventDefault()

    await fetch('api/shortcuts', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(json => {
        updateShortcuts(json.data)
        e.target.reset()
      })
  }
  

  async function deleteShortcut(shortcutID) {


    await fetch('api/shortcuts', {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: shortcutID })
    })
      .then(res => res.json())
      .then(json => {
        const newList = shortcuts.filter(i => i.id !== json.id)
        updateShortcuts(newList)
      })
  }

  const [editMode, setEditMode] = useState(false)

  function toggleEditMode() {
    editMode ? setEditMode(false) : setEditMode(true)
  }

  function Shortcuts({ shortcuts, editMode, ...props }) {

    const [list, updateList] = useState()

    useEffect(() => {

      const map = shortcuts.map((shortcut) => (
        <li
          className="roudend bg-white text-black rounded-lg p-1 hover:bg-blue-600 hover:text-white transition-all"
          key={shortcut.id}
        >
          <a href={shortcut.link} target="_blank">{shortcut.name}</a>
          {editMode && <button className="underline ml-1 text-red-500" onClick={() => { deleteShortcut(shortcut.id) }}>Delete</button>}
        </li>
      ))

      updateList(map)

    }, [shortcuts, editMode])




    return (
      <ul {...props}>{list}</ul>
    )
  }

  return (
    <>
      <Head>
        <title>My Shortcuts</title>
      </Head>
      <div className="p-2 relative h-screen">
        <Shortcuts
          className="text-center flex gap-2 flex-wrap"
          shortcuts={shortcuts}
          editMode={editMode}
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col border rounded-md p-4 gap-2 w-min mx-auto mt-4"
        >
          <input name="name" onChange={handleForm} type="text" placeholder="Shortcut Name" />
          <input name="link" onChange={handleForm} type="text" placeholder="Shortcut Link" />
          <button type="submit" className="hover:underline">Send Shortcut</button>
        </form>
        <span className="absolute bottom-2 left-2 cursor-pointer" onClick={() => { toggleEditMode() }}>Toggle Edit Mode</span>
      </div>
    </>
  )
}

export async function getServerSideProps() {

  const data = await getShortcuts()

  // console.log(data)

  return {
    props: { data }
  }
}