Target: Build a Liquidity Aggregator

Target Breakdown: 

1. The action to be performed is SWAP tokens
2. The user provides the input token name and amount
3. That token has to be routed in such a way that the user gets the max amount of return token possible

Plan of action:

1. Select the top 3 DEXs on Ethereum
2. Read and understand their contracts and look for fetching the quote for performing a SWAP
3. Write the contracts that is used to fetch the quote in phase 1
4. Work on figuring the most efficient route possible for performing the swap
5. Write the contracts that will be used to perform the swap

Project Workflow:

1. Execute a parallel development i.e. dev, script, and test