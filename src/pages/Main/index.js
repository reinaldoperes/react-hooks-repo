import React, { useState, useCallback } from 'react';
import { FaGithub, FaPlus } from 'react-icons/fa'
import {Container, Form, SubmitButton} from './styles';

import api from '../../services/api';

export default function Main(){

    const [novoRepo, setNovoRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);

    function handleInputChange(e){
        setNovoRepo(e.target.value);
    }

    const handleSubmit = useCallback(e => {
        e.preventDefault();

        async function submit(){
            const response = await api.get(`repos/${novoRepo}`);

            const data = {
                name: response.data.full_name,
            }
    
            setRepositorios([...repositorios, data]);
            setNovoRepo('');
        }

        submit();
        
    }, [novoRepo, repositorios])

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus repositórios
            </h1>

            <Form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Adicionar repositório"
                    value={novoRepo}
                    onChange={handleInputChange}
                />

                <SubmitButton>
                    <FaPlus color="#FFF" size={14} />
                </SubmitButton>
            </Form>
        </Container>
    )
}