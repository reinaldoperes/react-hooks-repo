import React, { useState, useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import {Container, Form, SubmitButton, List, DeleteButton} from './styles';

import api from '../../services/api';

export default function Main(){

    const [novoRepo, setNovoRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    //buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }

    }, []);

    //salvar
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);

    function handleInputChange(e){
        setNovoRepo(e.target.value);
        setAlert(null);
    }

    const handleSubmit = useCallback(e => {
        e.preventDefault();

        async function submit(){
            setLoading(true);
            setAlert(null);
            try {
                const response = await api.get(`repos/${novoRepo}`);

                const hasRepo = repositorios.find(r => r.name === novoRepo);

                if(hasRepo){
                    throw new Error('Repositório já existente!');
                }

                const data = {
                    name: response.data.full_name,
                }
        
                setRepositorios([...repositorios, data]);
                setNovoRepo('');

            } catch (error) {

                setAlert(true);
                console.log(error);

            } finally {
                setLoading(false);
            }                        
        }

        submit();
        
    }, [novoRepo, repositorios])

    const handleDelete = useCallback(repo => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios]);

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                    type="text"
                    placeholder="Adicionar repositório"
                    value={novoRepo}
                    onChange={handleInputChange}
                    required
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {
                        loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )
                    }                   
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name) }>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <a href="">
                            <FaBars size={20} />
                        </a>
                    </li>
                ))}       
            </List>

        </Container>
    )
}