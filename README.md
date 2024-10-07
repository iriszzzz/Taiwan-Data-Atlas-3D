# Taiwan-Data-Atlas-3D
The repository records the final project in Database System course at NYCU.

> This record and share the project of [Database Systems](https://timetable.nycu.edu.tw/?r=main/crsoutline&Acy=111&Sem=1&CrsNo=515514&lang=zh-tw) about a web application that visualizes Taiwan's regional data in a 3D interactive map. The primary goal is to present public datasets in a clear and dynamic format, enhancing public awareness and understanding of various social issues.

## Features

- **3D Data Visualization**: Displays data in an interactive 3D model, enabling users to explore Taiwan’s regional statistics intuitively.
- **Data Sources**: Incorporates publicly available datasets, including:
  - 107年成人保護級家庭暴力案件統計 (Statistics of Domestic Violence Cases for Protected Adults in 2018)
  - 交通事故每千人死傷數 (Traffic Accident Injury and Death Rates per 1,000 People)
  - 全國身心障礙機構一覽表 (List of Disability Welfare Institutions)
- **MongoDB Database Integration**: Utilizes MongoDB for storing and querying the data, ensuring efficient retrieval and updating.

## Data Sources

Our application relies on publicly available data from government platforms:

1. **Domestic Violence Statistics (2018)**  
   - [Data Source](https://data.gov.tw/dataset/147093)
   - Attributes: `Province`, `Region`, `Occurrence Number`, `Occupation`, and calculated `Ratio`.
   
2. **Disability Welfare Institutions**  
   - [Data Source](https://data.gov.tw/dataset/12061)
   - Attributes: `Province`, `Region`, `Total Facilities`, and calculated `Ratio`.

3. **Traffic Accident Statistics**  
   - [Data Source](https://roadsafety.tw/Dashboard/Custom?type=%E9%84%89%E9%8E%AE%E5%B8%82%E5%8D%80%E6%AF%8F%E5%8D%83%E4%BA%BA%E6%AD%BB(%E5%82%B7)%E6%95%B8)
   - Attributes: `Province`, `Region`, `Ratio of Deaths and Injuries`.

## Technical Overview

### Database Design

- **NoSQL Database (MongoDB)**: 
  - Schema follows a normalized data model to optimize write performance, especially useful when updating or fetching data for visualization. 
  - Key fields: `region_id`, `province_id`, `data`, `ratio`, and `occupation`.

### Backend

- **Node.js and Express**: Used for handling requests between the frontend and database.
- **Mongoose**: Handles the interaction with MongoDB, performing queries like `find()` for data retrieval and `deleteMany()` for data updating.

### Frontend

- **Vue.js**: Framework for creating the user interface.
- **Three.js**: Manages the 3D rendering of data.
- **Axios**: Used for handling API calls between frontend and backend.

### Data Flow

1. **Data Fetching**: API fetches `.csv` files from the open data platforms.
2. **Data Transformation**: Data is parsed, transformed to match the schema, and posted to the MongoDB database.
3. **Data Updating**: A timer is set to periodically delete and re-post data every 30 minutes, ensuring that the visualization stays up-to-date.

## Usage

1. Clone the repository:
    ```bash
    git clone https://github.com/username/Taiwan-Data-Atlas-3D.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up MongoDB and configure your `.env` file with the database URI.
4. Run the development server:
    ```bash
    npm run dev
    ```

## Video Demo

For a visual demonstration of the application, check out our video: [Video Link](https://youtu.be/PdxhdXAPpGY).

<br>

👨‍🏫 Advicing Professor : YI-RU ZENG

###### tags:  `Database` `SQL`  `AWS` `EC2` `Vue3` `MongoDB` `Three.js` 

> 🔍 Watch MORE ➜ [My GitHub](https://github.com/iriszzzz)

