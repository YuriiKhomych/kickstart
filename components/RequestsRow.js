import React, {Component} from "react";
import {Button, Form, Input, Message, Table} from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import {Router} from "../routes";

class RequestRow extends Component {
    // state = {
    //     value: '',
    //     errorMessage: '',
    //     loading: false
    // };
    //
    // onSubmit = async event => {
    //     event.preventDefault();
    //     this.setState({loading: true, errorMessage: ''})
    //
    //     const campaign = Campaign(this.props.address);
    //     try {
    //         const accounts = await web3.eth.getAccounts();
    //         await campaign.methods.contribute().send({
    //             from: accounts[0],
    //             value: web3.utils.toWei(this.state.value, 'ether')
    //         });
    //         Router.replaceRoute(`/campaigns/${this.props.address}`);
    //     } catch (err) {
    //         this.setState({errorMessage: err.message});
    //     }
    //     this.setState({loading: false, value: ''})
    // }
    onApprove = async () => {
        const campaign = Campaign(this.props.address);

        const account = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: account[0]
        });
    };
    onFinalize = async () => {
        const campaign = Campaign(this.props.address);

        const account = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: account[0]
        });
    };

    render() {
        const {Row, Cell} = Table;
        const {id, request, approversCount} = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>{
                    request.complete ? null : (
                        <Button color="green" basic onClick={this.onApprove}>
                            Approve</Button>
                    )
                }</Cell>
                <Cell>{
                    request.complete ? null : (
                        <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>
                    )
                }</Cell>
            </Row>
        )
    }

}

export default RequestRow;
