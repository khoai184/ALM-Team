package com.tim.appTim.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.appTim.entity.Class;
import com.tim.appTim.entity.ClassMember;
import com.tim.appTim.repository.ClassMemberRepository;
import com.tim.appTim.repository.ClassRepository;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private ClassMemberRepository classMemberRepository;

    public Optional<Class> getClassById(Long id) {
        return classRepository.findById(id);
    }

    public List<ClassMember> getClassMembersByClassId(Long classId) {
        return classMemberRepository.findByClassId(classId);
    }
}