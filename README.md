# React Stock Charts

Collection of common stock charts created with [React](https://reactjs.org/),
[React-Create-App](https://github.com/facebook/create-react-app) and
[Recharts](http://recharts.org/). This is still *work in progress*, so any
of the charts or data might not be correct or final.


## Getting started

Get you a copy of the project up and running on your local machine for
development and testing purposes.

### Prerequisites

- Running this code depends on Node.js. If you don't have it installed
[download it here](https://nodejs.org/en/).

- The data is fetched from [Alpha Advantage](https://www.alphavantage.co/) and
requires an API key for more frequent API calls. You can test the application
with light usage without an API key or [request one](https://www.alphavantage.co/support/#api-key)
and add it to the **.env** file (see **.env.example**)

### Installation

- Clone the code repository

```bash
$ git clone git@github.com:mpaulasaari/react-stock-charts.git
```

- Navigate to the cloned directory and install the dependencies

```bash
$ yarn install
```

- Run the code and it will automatically open your browser at
`http://localhost:3001/`

```bash
$ yarn start
```

### Usage

- Add a [ticker symbol name](https://en.wikipedia.org/wiki/Ticker_symbol) to the
url with a query `?symbol=`, for example to view Tesla's stock charts:
`http://localhost:3001/?symbol=TSLA`. *The application will load the entire
history of the stock in weekly chunks, so performance can be an issue when
viewing large datasets.*

- Hover over the charts to view more details and change the zoom level using the
slider below the **SMA** chart.


## Authors

- Mika Paulasaari - [github.com/mpaulasaari](https://github.com/mpaulasaari/)


## License

- MIT (see **LICENSE.md**)
