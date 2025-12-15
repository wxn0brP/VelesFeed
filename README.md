# Veles Feed

Veles Feed is a simple, client-side RSS feed reader. It allows you to add your favorite feed sources and view the articles in a clean and simple interface. All data is stored locally in your browser.

## Status

This project is currently a Proof of Concept (PoC) and is not production-ready.

## Features

- Add and manage multiple RSS feed sources
- Fetches and displays feed items
- Stores all data in the browser's local storage
- Simple and clean user interface

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/wxn0brP/VelesFeed.git
    ```
2.  Install `pressure` build tool via [`ingr`](https://github.com/wxn0brP/dotfiles):
    ```bash
    ingr pressure
    ```
4.  Install the dependencies using `bun`:
    ```bash
    cd VelesFeed
    bun install
    ```

## Usage

To start the development server, run:

```bash
suglite
```

This will start a development server at `http://localhost:19984`.

## Zhiva Integration

Veles Feed can be integrated with Zhiva by running:

```bash
zhiva install VelesFeed
```

## License

MIT [LICENSE](LICENSE)

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.