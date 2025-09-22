"use client"
import { useState } from "react"
import Layout from "../common/layout"
import Image from "next/image"
import MainCards from "./mainCards"
import DummyData from "./dummyData"

const Dashboard = () => {
    return(
        <Layout>
            <MainCards></MainCards>
            <DummyData></DummyData>
        </Layout>
    )
}

export default Dashboard
